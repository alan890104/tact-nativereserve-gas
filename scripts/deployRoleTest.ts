import { toNano } from 'ton-core';
import { RoleTest } from '../wrappers/ReserveTest';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const roleTest = provider.open(await RoleTest.fromInit());

    await roleTest.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(roleTest.address);

    // run methods on `roleTest`
}
