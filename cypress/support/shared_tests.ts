export const testReset = () => {
  it("resets to original state", () => {
    cy.getById("reset_button").click().blur();
    cy.matchImageSnapshot("original_state");
  });
};

export const testReposition = () => {
  it("repositions the image", () => {
    cy.getById("canvas").trigger("pointerdown", 300, 400, { which: 3 });
    cy.getById("canvas").trigger("mousemove", 300, 200);
    cy.getById("canvas").trigger("pointerup", 300, 200, { which: 3 });
    cy.matchImageSnapshot("dragged");
    cy.getById("reposition_button").click().blur();
    cy.matchImageSnapshot("original_state");
  });
};
