import { FunctionPixel } from "./geometry.js";



// ++++++++++ UTILITY FUNCTIONS AND DEFINITIONS ++++++++++

// global functions to transform calculation coordinates (center (0, 0), x-range [-8, 8], y-width [-5, 5])
export function x2c(x) {
    return 100*(x+8);
}

export function y2c(y) {
    return 100*(-y+5);
}


// global functions to calculate canvas coordinates to calculation coordinates
export function c2x(cx) {
    return cx / 100 - 8;
}

export function c2y(cy) {
    return -cy / 100 + 5;
}


// function to parse position and velocity (they are bound to certain limits, no fun allowed)
export function parse_x(input_x) {
    let x_limit = 1;
    if (input_x < -x_limit) {
        return -x_limit;
    }
    if (input_x > x_limit) {
        return x_limit;
    }
    return input_x;
}

export function parse_vx(input_vx) {
    let vx_limit = 1;
    if (input_vx < -vx_limit) {
        return -vx_limit;
    }
    if (input_vx > vx_limit) {
        return vx_limit;
    }
    return input_vx;
}


// function to parse time increment
export function parse_dt(s_dt) {
    return 0.025*10**(s_dt/10);
}


// number line class
export class NumberLine {
    nlx2c = this.nlx2c.bind(this);
    nly0 = this.nly0.bind(this);

    constructor(ctx, centre, x_length, x_range, x_label) {
        this.ax_min = x_range[0];
        this.ax_max = x_range[1];
        this.ax_dist = this.ax_max - this.ax_min;

        this.centre = centre;
        this.x_dist = x_length[1] - x_length[0];

        this.cx_centre = x2c(centre[0]);
        this.cy_centre = y2c(centre[1]);
        this.cx_low = x2c(centre[0] + x_length[0]);
        this.cx_high = x2c(centre[0] + x_length[1]);

        // x- and y-axis
        ctx.beginPath();
        ctx.moveTo(this.cx_low, this.cy_centre);
        ctx.lineTo(this.cx_high, this.cy_centre);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "grey";
        ctx.setLineDash([]);
        ctx.stroke();

        // x- and y-label
        ctx.font = "32px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "grey";
        ctx.fillText(x_label, this.cx_high + 30, this.cy_centre);
    }


    // convert ax coordinates to canvas coordinates
    nlx2c(ax) {
        let x = ax / this.ax_dist * this.x_dist + this.centre[0];
        return x2c(x);
    }


    // return the canvas y coordinate
    nly0() {
        return this.cy_centre;
    }
}


// coordinate system class
export class CoordinateSystem {
    ax2c = this.ax2c.bind(this);
    ay2c = this.ay2c.bind(this);
    draw_function = this.draw_function.bind(this);

    constructor(ctx, centre, x_length, y_length, x_range, y_range, x_label, y_label) {
        this.ax_min = x_range[0];
        this.ax_max = x_range[1];
        this.ay_min = y_range[0];
        this.ay_max = y_range[1];

        this.centre = centre;
        this.x_dist = x_length[1] - x_length[0];
        this.y_dist = y_length[1] - y_length[0];
        this.ax_dist = this.ax_max - this.ax_min;
        this.ay_dist = this.ay_max - this.ay_min;

        this.cx_centre = x2c(centre[0]);
        this.cy_centre = y2c(centre[1]);
        this.cx_low = x2c(centre[0] + x_length[0]);
        this.cx_high = x2c(centre[0] + x_length[1]);
        this.cy_low = y2c(centre[1] + y_length[0]);
        this.cy_high = y2c(centre[1] + y_length[1]);

        // x- and y-axis
        ctx.beginPath();
        ctx.moveTo(this.cx_low, this.cy_centre);
        ctx.lineTo(this.cx_high, this.cy_centre);
        ctx.moveTo(this.cx_centre, this.cy_low);
        ctx.lineTo(this.cx_centre, this.cy_high);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "grey";
        ctx.setLineDash([]);
        ctx.stroke();

        // x- and y-label
        ctx.font = "32px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "grey";
        ctx.fillText(x_label, this.cx_high + 30, this.cy_centre);
        ctx.fillText(y_label, this.cx_centre, this.cy_high - 30);
    }


    // convert ax coordinates to canvas coordinates
    ax2c(ax) {
        let x = ax / this.ax_dist * this.x_dist + this.centre[0];
        return x2c(x);
    }

    ay2c(ay) {
        let y = ay / this.ay_dist * this.y_dist + this.centre[1];
        return y2c(y);
    }


    // draw function
    draw_function(ctx, funct) {
        let resolution = 10000;
        for (let i = 0; i <= resolution; i += 1) {
            let ax_i = this.ax_min + i*this.ax_dist/resolution;
            let ay_i = funct(ax_i);

            let cx_i = this.ax2c(ax_i);
            let cy_i = this.ay2c(ay_i);

            new FunctionPixel(ctx, cx_i, cy_i, "white");
        }
        return;
    }
}