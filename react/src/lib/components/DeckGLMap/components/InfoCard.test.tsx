import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import "jest-styled-components";
import "@testing-library/jest-dom";
import React from "react";
import InfoCard from "./InfoCard";
import userEvent from "@testing-library/user-event";
import { Layer, PickInfo } from "deck.gl";
import { LayerProps } from "@deck.gl/core/lib/layer";

describe("Test Info Card", () => {
    it("snapshot test with no props", () => {
        const { container } = render(
            <InfoCard
                pickInfos={[
                    {
                        x: 152,
                        y: 254,
                        radius: 1,
                        depth: 638,
                        coordinate: [111, 222],
                    } as unknown as PickInfo<unknown>,
                    {
                        layer: { id: "wells-layer" } as Layer<
                            unknown,
                            LayerProps<unknown>
                        >,
                        property: {
                            name: "Poro WellA",
                            value: 123,
                        },
                    } as unknown as PickInfo<unknown>,
                ]}
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });
    it("collapse infocard", async () => {
        render(
            <InfoCard
                pickInfos={[
                    {
                        x: 152,
                        y: 254,
                        radius: 1,
                        depth: 638,
                        coordinate: [111, 222],
                    } as unknown as PickInfo<unknown>,
                ]}
            />
        );
        const collapse_button = screen.getByRole("button", { name: "" });
        expect(screen.getByText("111.00 m")).toBeVisible();
        userEvent.click(collapse_button);
        await waitForElementToBeRemoved(() => screen.getByText("111.00 m"));
    });
    it("undefined coordinates", async () => {
        const { container } = render(
            <InfoCard
                pickInfos={[
                    {
                        x: 152,
                        y: 254,
                        // @ts-expect-error: to be fixed
                        radius: 1,
                        depth: 638,
                        coordinate: undefined,
                    },
                ]}
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it("snapshot test when property value provided", async () => {
        const { container } = render(
            <InfoCard
                pickInfos={[
                    {
                        x: 152,
                        y: 254,
                        radius: 1,
                        depth: 638,
                        coordinate: [111, 222],
                    } as unknown as PickInfo<unknown>,
                    {
                        layer: {
                            id: "wells-layer",
                            props: { name: "Wells layer" },
                        },
                        properties: [
                            { name: "Poro", value: 123 },
                            { name: "Perm", value: 456 },
                        ],
                        logName: "LogCurve1",
                    } as unknown as PickInfo<unknown>,
                    {
                        layer: {
                            id: "hillshading-layer",
                            props: { name: "Hill shading" },
                        },
                        propertyValue: 3152.02,
                    } as unknown as PickInfo<unknown>,
                ]}
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});
