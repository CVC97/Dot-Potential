// ++++++++++ RANDOM NUMBER FUNCTIONS ++++++++++

// generate random gaussion from Box-Muller transform
export function get_random_gaussian(mean = 0, std = 1) {
    let u1 = 1 - Math.random();                                     // generate 2 random uniforms u1
    let u2 = Math.random();                                         // second random uniform u2
    let z1 = Math.sqrt(-2*Math.log(u1)) * Math.cos(2*Math.PI*u2);   // calculate random gaussian with mean 0 and std 1
    return z1 * std + mean;                                         // returning random gaussian with passed mean and std
}