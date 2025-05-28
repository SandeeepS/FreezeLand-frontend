import React from "react";
import { Button } from "@mui/material";

interface ButtonConfig {
  label: string;
  onClick: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  className?: string;
  disabled?: boolean;
}

interface CommonButtonSpaceProps {
  buttons: ButtonConfig[];
  alignment?: "left" | "right" | "center";
  spacing?: "small" | "medium" | "large";
  className?: string;
}

const CommonButtonSpace: React.FC<CommonButtonSpaceProps> = ({
  buttons,
  alignment = "right",
  spacing = "medium",
  className = "",
}) => {
  const getAlignmentClass = () => {
    switch (alignment) {
      case "left":
        return "justify-start";
      case "center":
        return "justify-center";
      case "right":
      default:
        return "justify-end";
    }
  };

  const getSpacingClass = () => {
    switch (spacing) {
      case "small":
        return "gap-2";
      case "large":
        return "gap-6";
      case "medium":
      default:
        return "gap-4";
    }
  };

  const getButtonSpacing = () => {
    switch (spacing) {
      case "small":
        return "mx-1";
      case "large":
        return "mx-3";
      case "medium":
      default:
        return "mx-2";
    }
  };

  return (
    <div className={`flex ${getAlignmentClass()} ${getSpacingClass()} px-2 ${className}`}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant || "contained"}
          color={button.color || "primary"}
          onClick={button.onClick}
          className={`${getButtonSpacing()} ${button.className || ""}`}
          disabled={button.disabled || false}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};

export default CommonButtonSpace;