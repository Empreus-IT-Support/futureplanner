/**
 * ============================================================================
 * PRESCRIBED COMPLIANCE WORDING — DO NOT CHANGE WITHOUT COMPLIANCE SIGN-OFF
 * ============================================================================
 *
 * Every string in this file is supplied wording. It is not marketing copy and
 * it is not yours to tighten, shorten, reword or reposition. Formatting rules
 * are enforced in globals.css and noted against each block.
 *
 * This file is the single allowlisted place where the restricted words
 * ("independent", "impartial", "unbiased") may appear, because the Lack of
 * Independence Statement is AVALONFS's own required wording.
 */

/**
 * "Lack of Independence" Statement — AVALONFS FSG v6.2, page 2.
 *
 * Formatting is prescribed: a visible box, a bold heading containing the
 * required phrase, font size no smaller than the surrounding body text, and
 * never a footnote. Do not reword it, do not move it to the footer, and do not
 * collapse it into an accordion. It belongs in the About section of the home
 * page, in normal reading flow.
 */
export const lackOfIndependence = {
  heading: '"Lack of Independence" Statement',
  body:
    'Your adviser may receive commission on life insurance products as explained ' +
    'in this FSG. For this reason, we cannot refer to ourselves or our advice as ' +
    'independent, impartial or unbiased. (See also Conflicts of Interest – Risk Products)',
}

/**
 * General advice warning. Appears above the footer on EVERY page. It is
 * rendered by the root layout so that any new route inherits it — if you ever
 * move it out of the layout, you must add it to every page by hand.
 */
export const generalAdviceWarning =
  'The information on this website is general in nature only. It has been prepared ' +
  'without taking into account your objectives, financial situation or needs. Before ' +
  'acting on it, consider whether it is appropriate for you, having regard to those ' +
  'matters, and read any relevant Product Disclosure Statement and Target Market ' +
  'Determination. We recommend you obtain personal financial advice before making any ' +
  'decision about a financial product.'

/**
 * Footer disclosure block. Appears on every page at body-size text and normal
 * contrast. Do not shrink it, put it behind an accordion, or lighten it
 * against the navy.
 */
export const footerDisclosure = {
  entity:
    'Graeme Davy (1000299), Andreas Koulouris (249603) and Future Planner Pty Ltd ATF ' +
    'Future Planner Trust (1321039), ABN 43 409 972 301, are Authorised Representatives ' +
    'of AVALONFS Pty Ltd, ABN 43 162 297 298, AFSL 437518.',
  body:
    'The information on this website is general in nature only and does not take into ' +
    'account your objectives, financial situation or needs. Before acting on any ' +
    'information on this site, consider whether it is appropriate for you and read any ' +
    'relevant Product Disclosure Statement and Target Market Determination. You should ' +
    'obtain personal financial advice before making a decision about a financial ' +
    'product. Past performance is not a reliable indicator of future performance.',
}

/**
 * The licensee strip under the home page hero. Deliberately styled as a
 * designed band rather than fine print — the licensing relationship is
 * load-bearing information for a client.
 */
export const licenseeStrip = {
  before:
    'Graeme Davy, Andreas Koulouris and Future Planner Pty Ltd ATF Future Planner Trust ' +
    'are Authorised Representatives of ',
  emphasis: 'AVALONFS Pty Ltd, AFSL 437518',
}

/** Collection notice shown beside the enquiry form. */
export const collectionNotice = {
  before:
    "We collect this information so we can respond to your enquiry. It's handled in line " +
    'with the ',
  linkText: 'AVALONFS Privacy Policy',
  after:
    ', which explains how it’s stored, who it may be shared with, and how you can ' +
    "access or correct it. We won't use it for marketing unless you ask us to.",
}
