import { get_random_gaussian } from "./rng.js";



// ++++++++++ PHYSICS OF THE CAT BEHAVIOUR ++++++++++

// potential class induced on the cat
export class CatPotential {
    get_potential = this.get_potential.bind(this);
    get_force = this.get_force.bind(this);

    constructor(g, delta) {
        this.g = g;
        this.delta = delta;
    }


    // get the potential for a given x
    get_potential(x) {
        return this.g * (x**2-1) * x**2 * (x**2-this.delta) / (x**2+this.delta);
    }


    // get the force from the above potential
    get_force(x) {
        let delta_x = 0.001;
        return -(this.get_potential(x+delta_x) - this.get_potential(x-delta_x)) / (2*delta_x);
    }
}


// Verlet-Maruyama integrator for the newtonian equation of motion of the cat
export class VerletMaruyama {
    step = this.step.bind(this);

    constructor(potential, bool_params, force_params, delta_t) {
        this.bool_friction = bool_params[0];
        this.bool_noise = bool_params[1];
        this.epsilon_friction = force_params[0];
        this.sigma_noise = force_params[1];
        this.m_mass = force_params[2];
        this.potential_force = potential.get_force;
        this.delta_t = delta_t;
    }


    // takes the state of the system and advances it one step
    step(state) {
        let x = state[0];                                                   // position x
        let vx = state[1];                                                  // velocity vx
        // support acceleration a1
        let a1 = this.potential_force(x) / this.m_mass;                     // calculate potential force into a1
        if (this.bool_friction) {
            a1 -= this.epsilon_friction*vx / this.m_mass;                   // adjust a1 by friction
        }
        if (this.bool_noise) {
            a1 += get_random_gaussian(0, this.sigma_noise) / this.m_mass;   // adjust a1 by gaussian noise
        }
        x += vx*this.delta_t + a1*this.delta_t**2/2;
        // support acceleration a2
        let a2 = this.potential_force(x) / this.m_mass; 
        if (this.bool_friction) {
            a2 -= this.epsilon_friction*vx / this.m_mass;                   // adjust a2 by friction
        }
        if (this.bool_noise) {
            a2 += get_random_gaussian(0, this.sigma_noise) / this.m_mass;   // adjust a2 by gaussian noise
        }
        vx += (a1 + a2) * this.delta_t/2;
        return [x, vx];
    }
}