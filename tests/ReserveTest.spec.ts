import { Blockchain, SandboxContract, TreasuryContract, prettyLogTransactions, printTransactionFees } from '@ton-community/sandbox';
import { address, toNano } from 'ton-core';
import { Reserve } from '../wrappers/ReserveTest';
import '@ton-community/test-utils';

describe('RoleTest', () => {
    let blockchain: Blockchain;
    let reserveContract: SandboxContract<Reserve>;
    let deployer: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        reserveContract = blockchain.openContract(await Reserve.fromInit(2n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await reserveContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: reserveContract.address,
            deploy: true,
            success: true,
        });

        // Assume contract has 1 Ton
        await reserveContract.send(deployer.getSender(), { value: toNano('1') }, null);
        const balance = await reserveContract.getBalance();
        expect(Number(balance / 10n**10n)).toBeCloseTo(Number(toNano("1") / 10n**10n),2);
    });

    it('should deploy', async () => {
    });

    it("Should nativeReserve", async() => {
        
        const balanceBefore = await reserveContract.getBalance();
        const result = await reserveContract.send(deployer.getSender(),{value: toNano("3")}, "n");
        prettyLogTransactions(result.transactions);
        printTransactionFees(result.transactions);
        const balanceAfter = await reserveContract.getBalance();
        console.log("nativeReserve | Balance before: ", balanceBefore, " Balance after: ", balanceAfter);
    })  
    
    it('Should deduct directly', async () => {
        const balanceBefore = await reserveContract.getBalance();
        const result = await reserveContract.send(deployer.getSender(), {value: toNano("3")}, "u");
        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: reserveContract.address,
            success: true,
        });
        prettyLogTransactions(result.transactions);
        printTransactionFees(result.transactions);
        const balanceAfter = await reserveContract.getBalance();
        console.log("Deduct | Balance before: ", balanceBefore, " Balance after: ", balanceAfter);
    })
});
