export const MOCK_CONTENT = {
  columns: `<div>Add columns mark up here</div>
`,
  'about-us': `<div>Add about-us mark up here</div>
`,
  // Add other block mock content

  herobanner: `<div>Add hero banner mark up here</div>
`,
  tiles: `<div>Add tiles mark up here</div>
`,
  // Add other block mock content
  listing: `<div>Add listing mark up here</div>
`,
  // Add other block mock content

  footer: `<div>Add footer mark up here</div>
`,
  header: `<div>Add header mark up here</div>
`,
  projectslist: `<div>Add projectslist mark up here</div>
`,
    mediagallery:`<div 
  data-aue-type="container" data-aue-behavior="component" data-aue-model="mediagallery" style="padding-inline: 44px;" 
  data-aue-label="mediagallery" data-aue-filter="mediagallery" data-block-name="mediagallery" data-block-status="loaded">
  <div class="mediagallery-wrapper">
        <div class="mediagallery mg-two-one mg-two-one-row block" data-block-name="mediagallery" data-block-status="loaded">
            <div class="mediagallery mg-two-one-nested-1-1">
                <img src="https://delivery-p144202-e1512622.adobeaemcloud.com/adobe/assets/urn:aaid:aem:c199f13b-2fa2-4d41-8989-14aa52989c9b" alt="alt1" style="width: 349px; height: 206px; display: block;" />
            </div>
            <div class="mediagallery mg-two-one-nested-1-2">
                <img src="https://delivery-p144202-e1512622.adobeaemcloud.com/adobe/assets/urn:aaid:aem:999c0580-040a-4185-87b0-13fea75810a5" alt="alt2" style="width: 349px; height: 206px; display: block;" />
            </div>
            <div class="mediagallery mg-two-one-nested-1-3">
                <img src="https://delivery-p144202-e1512622.adobeaemcloud.com/adobe/assets/urn:aaid:aem:ef40f63d-c6ae-438c-a8ce-05911f043fa5" alt="alt3" style="width: 349px; height: 206px; display: block;" />
            </div>
        </div>
    </div>
    <div class="mediagallery-wrapper">
        <div class="mediagallery mg-one-two mg-one-two-row block" data-block-name="mediagallery" data-block-status="loaded">
            <div class="mediagallery mg-one-two-nested-1-1">
                <img src="https://delivery-p144202-e1512622.adobeaemcloud.com/adobe/assets/urn:aaid:aem:9d911164-b60a-4db1-a4b2-4ed952d51742" alt="alt11" style="width: 349px; height: 206px; display: block;" />
            </div>
            <div class="mediagallery mg-one-two-nested-1-2">
                <img src="https://delivery-p144202-e1512622.adobeaemcloud.com/adobe/assets/urn:aaid:aem:b92a5dcf-0cce-4625-b8d4-9b121ff4838e" alt="alt22" style="width: 349px; height: 206px; display: block;" />
            </div>
            <div class="mediagallery mg-one-two-nested-1-3">
                <img src="https://delivery-p144202-e1512622.adobeaemcloud.com/adobe/assets/urn:aaid:aem:f2d8a63e-d3ac-432b-80a1-cba1681987bd" alt="alt33" style="width: 349px; height: 206px; display: block;" />
            </div>
        </div>
    </div>
    <div class="mediagallery-wrapper">
        <div class="mediagallery mg-one-one-one mg-one-one-one-row block" data-block-name="mediagallery" data-block-status="loaded">
            <div class="mediagallery mg-one-one-one-nested-1-1">
                <img src="https://delivery-p144202-e1512622.adobeaemcloud.com/adobe/assets/urn:aaid:aem:1502b14b-5e12-4c01-b021-9bb8c5f51ac0" alt="alt111" style="width: 349px; height: 206px; display: block;" />
            </div>
            <div class="mediagallery mg-one-one-one-nested-1-2">
                <img src="https://delivery-p144202-e1512622.adobeaemcloud.com/adobe/assets/urn:aaid:aem:aa14fac9-3366-44dd-8675-b2494819712b" alt="alt222" style="width: 349px; height: 206px; display: block;" />
            </div>
            <div class="mediagallery mg-one-one-one-nested-1-3">
                <img src="https://delivery-p144202-e1512622.adobeaemcloud.com/adobe/assets/urn:aaid:aem:c9f1b17c-00c6-42bb-8c39-27db12413fe1" alt="alt333" style="width: 349px; height: 206px; display: block;" />
            </div>
        </div>
    </div>
</div>
`
};

export function loadMockContent(blockName) {
  return MOCK_CONTENT[blockName] || '';
}

// style="padding-inline: 165px;"