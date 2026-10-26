import site from '../data/site.json';

// These are public identifiers, never passwords or client secrets.
const settings = site as typeof site & {
  analyticsMeasurementId?: string;
  analyticsPropertyId?: string;
  analyticsClientId?: string;
};
export const analytics = {
  measurementId: /^G-[A-Z0-9]+$/.test(settings.analyticsMeasurementId?.trim() || '') ? settings.analyticsMeasurementId!.trim() : '',
  propertyId: /^\d+$/.test(settings.analyticsPropertyId?.trim() || '') ? settings.analyticsPropertyId!.trim() : '',
  clientId: /^[\w.-]+\.apps\.googleusercontent\.com$/.test(settings.analyticsClientId?.trim() || '') ? settings.analyticsClientId!.trim() : '',
};
