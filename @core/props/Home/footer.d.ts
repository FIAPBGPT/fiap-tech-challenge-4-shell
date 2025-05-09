/**
 * Represents the properties for the Footer component.
 */
interface FooterProps {
  /**
   * List of service names.
   */
  readonly services: readonly string[];

  /**
   * Contact information.
   */
  readonly contact: {
    /**
     * Phone number.
     */
    readonly phone: string;

    /**
     * Primary email address.
     */
    readonly email: string;

    /**
     * Support email address.
     */
    readonly supportEmail: string;
  };

  /**
   * Text indicating what the application was developed with.
   */
  readonly developedWith: string;

  /**
   * Source URL for the logo image.
   */
  readonly logoSrc: string;

  /**
   * Social media links with image sources and alt text.
   */
  readonly socialMedia: readonly {
    /**
     * Source URL for the social media icon.
     */
    readonly imgSrc: string;

    /**
     * Alt text for the social media icon.
     */
    readonly alt: string;
  }[];
}
