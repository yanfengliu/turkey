import {
  polygon_mode_coordinates,
  polygon_mode_coordinates_2,
  waiting_time,
} from "../fixtures/constants";
import { testReposition, testReset } from "../support/shared_tests";

describe("Polygon annotation mode", () => {
  beforeEach(() => {
    cy.visit("/localDemo");
    cy.wait(waiting_time.page_ready);
    cy.getById("mode_button").click().click();
  });

  testReposition();

  it("can select polygon mode", () => {
    cy.getById("mode_button").should("have.value", "Mode: Polygon");
  });

  describe("buttons", () => {
    beforeEach(() => {
      polygon_mode_coordinates.forEach((coordinate) => {
        cy.get("canvas").click(coordinate.x, coordinate.y);
      });
      cy.get("body").type("c");
    });

    it("can change class", () => {
      cy.getById("label_class").select("class1");
      polygon_mode_coordinates_2.forEach((coordinate) => {
        cy.get("canvas").click(coordinate.x, coordinate.y);
      });
      cy.get("body").type("c");
      cy.get("canvas").matchImageSnapshot("multi_class");
    });

    it("allows annotation", () => {
      cy.get("canvas").matchImageSnapshot("2_polygons");
    });

    describe("undo", () => {
      it("can undo by clicking the button", () => {
        cy.getById("undo_button").click();
        cy.get("canvas").matchImageSnapshot("1_polygon");
      });

      it("can undo by keyboard shortcut", () => {
        cy.get("body").type("{ctrl}z");
        cy.get("canvas").matchImageSnapshot("1_polygon");
      });
    });

    describe("delete", () => {
      it("can delete by clicking the button", () => {
        cy.getById("delete_button").click();
        cy.get("canvas").click(
          polygon_mode_coordinates[2].x,
          polygon_mode_coordinates[2].y
        );
        cy.getById("annotate_button").click();
        cy.get("canvas").matchImageSnapshot("1_polygon");
      });

      it("can delete by keyboard shortcut", () => {
        cy.get("body").type("d");
        cy.get("canvas").click(
          polygon_mode_coordinates[2].x,
          polygon_mode_coordinates[2].y
        );
        cy.get("body").type("d");
        cy.get("canvas").matchImageSnapshot("1_polygon");
      });
    });

    testReset();
  });
});
