export const extractCampaignId = match => (
  isNaN(match.params.campaign) ?
    match.params.campaign :
    Number(match.params.campaign)
);
