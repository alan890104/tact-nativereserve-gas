import "@stdlib/deploy";
import "@stdlib/ownable";

contract Reserve with Deployable {
    init (seed: Int) {}
    receive ("n") {
        let ctx: Context = context();
        require(ctx.value > ton("1"), "not enough value");
        nativeReserve(ton("1"), 0);
        send(SendParameters{
            to: newAddress(0, 0),
            value: 0,
            bounce: false,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }
    receive("u") {
        let ctx: Context = context();
        require(ctx.value > ton("1"), "not enough value");

        send(SendParameters{
            to: newAddress(0, 0),
            value: ctx.value - ton("1"),
            bounce: false,
            mode: SendPayGasSeparately + SendIgnoreErrors
        });
    }

    get fun balance(): Int {
        return myBalance();
    }
}