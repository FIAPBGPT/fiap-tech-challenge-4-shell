// Reusable type for links
/**
 * Represents a hyperlink with a label and a URL.
 */
interface Link {
  label: string;
  href: string;
}

// Reusable type for buttons
/**
 * Represents a button component that extends the properties of a link.
 *
 * @extends Link
 *
 * @property {string} variant - Specifies the visual style or variant of the button.
 */
interface Button extends Link {
  variant: string;
}

// Improved HeaderProps interface
/**
 * Represents the properties for the Header component.
 *
 * @property logoSrc - The source URL for the logo displayed in the header.
 * @property links - An array of navigation links to be displayed in the header.
 * @property buttons - An array of action buttons to be displayed in the header.
 * @property themedColor - The themed color applied to the header.
 */
interface HeaderProps {
  readonly logoSrc: string; // Source URL for the logo
  readonly links: readonly Link[]; // Navigation links
  readonly buttons: readonly Button[]; // Action buttons
  readonly themedColor: string; // Themed color for the header
}
