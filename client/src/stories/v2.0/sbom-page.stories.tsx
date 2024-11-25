import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { SbomList } from "@app/pages/sbom-list/sbom-list";
import { BrowserRouter } from "react-router-dom";
// import { http, HttpResponse } from "msw";

const meta = {
  title: "v2.0/SBOMs/SBOM List",
  component: SbomList,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof SbomList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryState: Story = {};

// export const EmptyState: Story = {
//   parameters: {
//     msw: {
//       handlers: [
//         http.get("/api/v1/vulnerability/", () => {
//           return HttpResponse.json([]);
//         }),
//       ],
//     },
//   },
// };
