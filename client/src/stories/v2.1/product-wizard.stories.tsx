import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DualListSelector, Wizard, WizardStep } from "@patternfly/react-core";

const ProductWizard: React.FC = () => {
  const [availableOptions, setAvailableOptions] = React.useState<
    React.ReactNode[]
  >(["SBOM Option 1", "SBOM Option 2", "SBOM Option 3", "SBOM Option 4"]);
  const [chosenOptions, setChosenOptions] = React.useState<React.ReactNode[]>(
    []
  );

  const onListChange = (
    event: React.MouseEvent<HTMLElement>,
    newAvailableOptions: React.ReactNode[],
    newChosenOptions: React.ReactNode[]
  ) => {
    setAvailableOptions(newAvailableOptions.sort());
    setChosenOptions(newChosenOptions.sort());
  };

  return (
    <>
      Product Wizard
      <Wizard height={400} title="Basic wizard">
        <WizardStep name="Details" id="basic-first-step">
          <p>
            The content of this step overflows and creates a scrollbar, which
            causes a tabindex of "0", a role of "region", and an aria-label or
            aria-labelledby to be applied.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            bibendum in neque nec pharetra. Duis lacinia vel sapien ut
            imperdiet. Nunc ultrices mollis dictum. Duis tempus, massa nec
            tincidunt tempor, enim ex porttitor odio, eu facilisis dolor tortor
            id sapien. Etiam sit amet molestie lacus. Nulla facilisi. Duis eget
            finibus ipsum. Quisque dictum enim sed sodales porta. Curabitur eget
            orci eu risus posuere pulvinar id nec turpis. Morbi mattis orci vel
            posuere tincidunt. Fusce bibendum et libero a auctor.
          </p>
          <p>
            Proin elementum commodo sodales. Quisque eget libero mattis, ornare
            augue at, egestas nisi. Mauris ultrices orci fringilla pretium
            mattis. Aliquam erat volutpat. Sed pharetra condimentum dui, nec
            bibendum ante. Vestibulum sollicitudin, sem accumsan pharetra
            molestie, purus turpis lacinia lorem, commodo sodales quam lectus a
            urna. Nam gravida, felis a lacinia varius, ex ipsum ultrices orci,
            non egestas diam velit in mi. Ut sit amet commodo orci. Duis sed
            diam odio. Duis mi metus, dignissim in odio nec, ornare aliquet
            libero. Sed luctus elit nibh. Quisque et felis diam. Integer ac
            metus dolor.
          </p>
        </WizardStep>
        <WizardStep name="SBOMs" id="basic-second-step">
          <p>SBOM Selection</p>
          {/* <DualListSelector
            availableOptions={availableOptions}
            chosenOptions={chosenOptions}
            onListChange={onListChange}
            addAllTooltip="Add all options"
            addAllTooltipProps={{ position: "top" }}
            addSelectedTooltip="Add selected options"
            addSelectedTooltipProps={{ position: "right" }}
            removeSelectedTooltip="Remove selected options"
            removeSelectedTooltipProps={{ position: "left" }}
            removeAllTooltip="Remove all options"
            removeAllTooltipProps={{ position: "bottom" }}
            id="dual-list-selector-basic-tooltips"
          /> */}
        </WizardStep>
        <WizardStep name="Validation" id="basic-third-step">
          <h2>Product Validation</h2>
          <p>What goes here?</p>
        </WizardStep>
        <WizardStep
          name="Review"
          id="basic-review-step"
          footer={{ nextButtonText: "Finish" }}
        >
          Review step content
        </WizardStep>
      </Wizard>
    </>
  );
};

const meta = {
  title: "v2.1/Product Wizard",
  component: ProductWizard,
} satisfies Meta<typeof ProductWizard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryState: Story = {
  args: {
    userStory: "As a developer I want to add a new Product.",
  },
};
