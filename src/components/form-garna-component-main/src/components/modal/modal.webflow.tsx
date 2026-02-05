import Modal from "./modal"; // Import your React component here
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";

export default declareComponent(Modal, {
  name: "Modal cal.com",
  description: "Modal cal.com module",
  group: "Info",
  props: {
    // ===== Content =====
    calComLink: props.Text({
      name: "cal.com link",
      defaultValue: "garna/demo",
    }),

    titleButton: props.Text({
      name: "Title button",
      defaultValue: "Book a demo",
    }),

    titleButtonForm: props.Text({
      name: "Title button form",
      defaultValue: "Continue",
    }),

    title: props.Text({
      name: "Title",
      defaultValue: "Title insert here",
    }),

    subtitle: props.Text({
      name: "Subtitle",
      defaultValue: "Subtitle insert here",
    }),

    // ===== Cal.com Background =====
    bgColorCal: props.Text({
      name: "Cal background color",
      defaultValue: "#0a0a0a",
    }),

    // ===== Brand colors =====
    colorBrandBg: props.Text({
      name: "Brand color (buttons & active states)",
      defaultValue: "#5ea500",
    }),

    colorBrandText: props.Text({
      name: "Brand text color (on buttons)",
      defaultValue: "#ffffffff",
    }),

    // ===== Borders =====
    colorBorder: props.Text({
      name: "Default border color",
      defaultValue: "rgb(34, 34, 34)",
    }),

    thicknessBorder: props.Text({
      name: "Border thickness",
      defaultValue: "1px",
    }),

    radiusBorder: props.Text({
      name: "Border radius",
      defaultValue: "32px",
    }),

    // ===== Text colors =====
    colorTextMain: props.Text({
      name: "Primary text color",
      defaultValue: "#ffffffff",
    }),

    colorTextCalendar: props.Text({
      name: "Secondary text color (calendar labels)",
      defaultValue: "#a4a4a4ff",
    }),

    colorTextError: props.Text({
      name: "Error text color",
      defaultValue: "pink",
    }),

    // ===== Calendar specifics =====
    colorBorderTimeCalendar: props.Text({
      name: "Time slot border color",
      defaultValue: "#ffffff9a",
    }),

    colorBorderVerticalLine: props.Text({
      name: "Calendar vertical divider color",
      defaultValue: "rgb(34, 34, 34)",
    }),

    // ===== Header / Logo =====
    colorTextLogo: props.Text({
      name: "Logo text color",
      defaultValue: "#5d5d5dff",
    }),
  },
});
