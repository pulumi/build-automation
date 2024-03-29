import { describe, expect, test } from "@jest/globals";
import { render } from "./make";
import { bridgedProviderV2 } from "./make-bridged-provider-2";

test("Makefile snapshot", () => {
  const makefile = render(
    bridgedProviderV2({
      "major-version": 1,
      provider: "pulumi-test-provider",
      providerVersion:
        "github.com/pulumi/terraform-provider-test-provider/version.ProviderVersion",
    })
  );
  expect(makefile).toMatchSnapshot();
});
