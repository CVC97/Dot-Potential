import { x2c, y2c, NumberLine, CoordinateSystem } from "./utilities.js"
import { manim_red } from "./catsim.js";



// ++++++++++ ANIMATED OBJECTS SECTION ++++++++++

// draws a circle at canvas coordinate
export class FunctionPixel {
    constructor(ctx, cx, cy, color) {
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.fill();
    }
}


// take the cat image and put it on canvas
export class DrawImage {
    constructor(ctx, image, coordinate_system, number_line, potential_function, ax) {
        this.ax_cx = coordinate_system.ax2c(ax);
        this.ax_cy = coordinate_system.ay2c(potential_function(ax));
        this.nl_cx = number_line.nlx2c(ax);
        this.nl_cy = number_line.nly0();

        // dashed connector
        ctx.beginPath();
        ctx.moveTo(this.nl_cx, this.nl_cy);
        ctx.lineTo(this.ax_cx, this.ax_cy);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.setLineDash([5, 5]); 
        ctx.stroke();      

        // "cat" dot
        ctx.beginPath();
        ctx.arc(this.nl_cx, this.nl_cy, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.lineWidth = 1;
        ctx.fill();

        // potential dot
        ctx.beginPath();
        ctx.arc(this.ax_cx, this.ax_cy, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.lineWidth = 1;
        ctx.fill();
    }
}


// draws an arrow given start / end point, color, width, and stroke dash
export class Arrow {
    constructor(ctx, start, end, color = "white", stroke_width = 4, stroke_dash = []) {
        this.cx_start = start[0];
        this.cy_start = start[1];
        this.cx_end = end[0];
        this.cy_end = end[1];

        ctx.beginPath();
        ctx.moveTo(this.cx_start, this.cy_start);
        ctx.lineTo(this.cx_end, this.cy_end);
        ctx.lineWidth = stroke_width;
        ctx.strokeStyle = color;
        ctx.setLineDash(stroke_dash);

        this.end_start_vector_length = Math.sqrt((this.cx_end-this.cx_start)**2 + (this.cy_end-this.cy_start)**2);
        this.tip_line_factor = 20;
        this.tip_line = [(this.cx_start-this.cx_end) / this.end_start_vector_length * this.tip_line_factor, (this.cy_start-this.cy_end) / this.end_start_vector_length * this.tip_line_factor];
        this.tip_line_angle = Math.PI / 6;

        ctx.moveTo(this.cx_end, this.cy_end);
        ctx.lineTo(
            this.cx_end + Math.cos(this.tip_line_angle)*this.tip_line[0] - Math.sin(this.tip_line_angle)*this.tip_line[1], 
            this.cy_end + Math.sin(this.tip_line_angle)*this.tip_line[0] + Math.cos(this.tip_line_angle)*this.tip_line[1]
        );
        ctx.moveTo(this.cx_end, this.cy_end);
        ctx.lineTo(
            this.cx_end + Math.cos(-this.tip_line_angle)*this.tip_line[0] - Math.sin(-this.tip_line_angle)*this.tip_line[1], 
            this.cy_end + Math.sin(-this.tip_line_angle)*this.tip_line[0] + Math.cos(-this.tip_line_angle)*this.tip_line[1]
        );
        ctx.stroke();
    }
}
