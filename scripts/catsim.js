import { CatPotential, VerletMaruyama } from "./physics.js";
import { x2c, y2c, parse_x, parse_vx, parse_dt, NumberLine, CoordinateSystem } from "./utilities.js"
import { DrawImage } from "./geometry.js";


// building canvas
export const canvas = document.getElementById("CatCanvas");
export const ctx = canvas.getContext("2d");

// global definitions
export const manim_red = "#FC6255";
export const manim_blue = "#58C4DD";



// ++++++++++ PARAMETER SECTION ++++++++++

// parameters of the potential
let g_coupling = 1;                                 // coupling constant between cat and human
let delta_bonding = 0.5;                            // specific bonding strength between cat and humam

// parameters of the system
let epsilon_friction = 0.25;                        // friction coefficient epsilon           
let sigma_noise = 1.5;                              // strength of the gaussian white noise
let call_strength = 0.25;                           // responsiveness of the cat towards calls
let m_mass = 1;                                     // mass of the cat
let force_params = [epsilon_friction, sigma_noise, m_mass];

// animation checks /params
let bool_friction = 1;                              // bool: (how strong) will friction force be considered (USER OPTION)
let bool_noise = 1;                                 // bool: (how strong) will gaussian white noise be considered (USER OPTION)
let bool_params = [bool_friction, bool_noise];

// integration parameters
let delta_t = 0.025;                                // stepsize of the numerical integration / animation speed (USER OPTION)

// initial conditions
let x = -0.5;
let vx = 0.5;
let state = [x, vx];

let animation_state = 0;                            // sets the animation state (0 for STOPPED, 1 for RUNNING)
let raf;                                            // animation handler



// ++++++++++ MAIN SECTION ++++++++++

// building coordinate system and potential
let axis = new CoordinateSystem(ctx, [0, 1], [-6, 6], [-2.5, +2.5], [-1.3, 1.3], [-0.2, 0.2], "x", "V(x)");
let nline = new NumberLine(ctx, [0, -3], [-6, 6], [-1.3, 1.3], "x");
let potential = new CatPotential(g_coupling, delta_bonding);
let potential_function = axis.draw_function(ctx, potential.get_potential);

// saving canvas background for save and reset
let save_image = new Image();
save_image.src = canvas.toDataURL("images/save_background.jpg");
let reset_image = new Image();
reset_image.src = canvas.toDataURL("images/reset_background.jpg");

// preload cat image
let cat_image = new Image();
cat_image.src = "./images/cat1.png";

// setting up integrator and place preloaded cat
let verlet_maruyama = new VerletMaruyama(potential, bool_params, force_params, delta_t);
cat_image.onload = () => {
    new DrawImage(ctx, cat_image, axis, nline, potential.get_potential, x);
}



// ++++++++++ EVENT FUNCTIONS ++++++++++

// draws animation frame, moves animated objects to their next position obtained by calling the integrator 
function draw() {
    // clear canvas and load background image 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(save_image, 0, 0);

    // construct new animation objects
    state = verlet_maruyama.step(state);
    x = state[0];
    vx = state[1];
    new DrawImage(ctx, cat_image, axis, nline, potential.get_potential, x);

    // request new animation frame
    raf = window.requestAnimationFrame(draw);
} 


// updates the drawn cat potential
function update_potential() {
    g_coupling = parseFloat(document.getElementById("coupling_constant").value);
    delta_bonding = parseFloat(document.getElementById("bond_strength").value);
    console.log(delta_bonding)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // build new potential
    axis = new CoordinateSystem(ctx, [0, 1], [-6, 6], [-2.5, +2.5], [-1.3, 1.3], [-0.2, 0.2], "x", "V(x)");
    nline = new NumberLine(ctx, [0, -3], [-6, 6], [-1.3, 1.3], "x");
    potential = new CatPotential(g_coupling, delta_bonding);
    potential_function = axis.draw_function(ctx, potential.get_potential); 

    // saving the canvas background for new frame and reset
    save_image = new Image();
    save_image.src = canvas.toDataURL("images/save_background.jpg");
    reset_image = new Image();
    reset_image.src = canvas.toDataURL("images/reset_background.jpg");

    // setting up integrator and place cat
    verlet_maruyama = new VerletMaruyama(potential, bool_params, force_params, delta_t);
    new DrawImage(ctx, cat_image, axis, nline, potential.get_potential, x);
}


// function to update physical parameters (updates pressure field) and new force parameters (updates integrator)
function update_params() {
    delta_t = parse_dt(parseInt(document.getElementById("delta_t").value));
    epsilon_friction = parseFloat(document.getElementById("number_friction").value);
    sigma_noise = parseFloat(document.getElementById("number_noise").value);

    force_params = [epsilon_friction, sigma_noise, m_mass]
    verlet_maruyama = new VerletMaruyama(potential, bool_params, force_params, delta_t);
}


// function to update force parameters (aka bool values for coriolis force and friction force)
function update_bool() {
    if (document.getElementById("check_friction").checked == true) {
        bool_friction = 1;
        document.getElementById("number_friction").disabled = false;
    } else {
        bool_friction = 0;
        document.getElementById("number_friction").disabled = true;
    }
    if (document.getElementById("check_noise").checked == true) {
        bool_noise = 1;
        document.getElementById("number_noise").disabled = false;
    } else {
        bool_noise = 0;
        document.getElementById("number_noise").disabled = true;
    }
    bool_params = [bool_friction, bool_noise];
    verlet_maruyama = new VerletMaruyama(potential, bool_params, force_params, delta_t);
}



// ++++++++++ EVENT LISTENERS ++++++++++

// start button
document.getElementById("start_button").addEventListener("click", (event) => {
    if (animation_state == 0) {
        raf = window.requestAnimationFrame(draw);
        animation_state = 1;
        document.getElementById('start_button').innerHTML = "STOP";
    } else {
        window.cancelAnimationFrame(raf);
        animation_state = 0;
        document.getElementById('start_button').innerHTML = "START";
    }
})


// call the cat button
document.getElementById("call_button").addEventListener("click", (event) => {
    x = state[0];
    vx = state[1];
    if (x < 0) {
        vx += call_strength;
    } else {
        vx -= call_strength;
    }
    state = [x, vx];
})


// reset animation button
document.getElementById("reset_button").addEventListener("click", (event) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(reset_image, 0, 0);
    save_image.src = canvas.toDataURL("images/save_background.jpg");
    
    // transfer resetted state to air mass and redraw
    x = parse_x(parseFloat(document.getElementById("init_x").value));
    document.getElementById("init_x").value = x;
    vx = parse_vx(parseFloat(document.getElementById("init_vx").value));
    document.getElementById("init_vx").value = vx;
    state = [x, vx];
    new DrawImage(ctx, cat_image, axis, nline, potential.get_potential, x);
})


// track interactions with the navigation bar
document.getElementById("coupling_constant").addEventListener("change", update_potential);
document.getElementById("bond_strength").addEventListener("change", update_potential);

document.getElementById("number_friction").addEventListener("change", update_params);
document.getElementById("number_noise").addEventListener("change", update_params);
document.getElementById("delta_t").addEventListener("change", update_params);

document.getElementById("check_friction").addEventListener("click", update_bool);
document.getElementById("check_noise").addEventListener("click", update_bool);