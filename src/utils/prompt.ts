import { colors } from "./logger";

export async function prompt(question: string): Promise<string> {
    return new Promise(resolve => {
        process.stdout.write(`${colors.magenta}${question}${colors.white}>`);
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
}