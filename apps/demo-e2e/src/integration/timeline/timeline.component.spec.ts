describe('demo', () => {
  beforeEach(() => cy.visit('/iframe.html?id=timelinecomponent--primary&knob-date&knob-zoom=0&knob-baseTickSize=1&knob-moveAmount=1&knob-moveOnKeyboard=true&knob-moveOnWheel=true&knob-virtualizationBuffer=0.5&knob-zoomDeltaFactor=1.06&knob-zoomOnKeyboard=true&knob-zoomOnWheel=true'));

  it('should render the component', () => {
    cy.get('demo-timeline').should('exist');
  });
});
