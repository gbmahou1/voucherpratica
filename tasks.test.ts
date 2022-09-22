import { jest } from "@jest/globals";

import voucherService, { VoucherCreateData } from "./src/services/voucherService.js";
import voucherRepository from "./src/repositories/voucherRepository.js";

jest.mock("./../../src/repositories/voucherRepository.js");

describe("voucherService test suite", () => {

  it("trying to create voucher", async () => 
  {
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => { });
    jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce((): any => { });

    await voucherService.createVoucher("aaa", 10);
    expect(voucherRepository.getVoucherByCode).toBeCalled();
  })

  it("testing iscount", async () => {
    const voucher: VoucherCreateData = { used: true, code: "AAA", discount: 10 };

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return {
        id: 1,
        code: voucher.code,
        discount: voucher.discount,
        used: false
      }
    });
    jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any => { });

    const amount = 1000;
    const order = await voucherService.applyVoucher(voucher.code, amount);
    expect(order.amount).toBe(amount);
    expect(order.discount).toBe(voucher.discount);
    expect(order.finalAmount).toBe(amount - (amount * (voucher.discount / 100)));
  })
})