import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/reserve.tact',
    options:{
        debug: true,
    }
};
