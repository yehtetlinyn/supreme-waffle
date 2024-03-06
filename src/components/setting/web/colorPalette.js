import React from "react";
import brandStyle from "./style.module.css";
import useAgencySettingStore from "@/store/agencySettingStore";
const ColorPalette = () => {
  const {
    backgroundColor,
    primaryColor,
    secondaryColor,
    tableColor,
    textColor,
    buttonColor,
    handlePrimaryColorChange,
    handleSecondaryColorChange,
    handleBackgroundColorChange,
    handleTableColorChange,
    handleTextColorChange,
    handleButtonColorChange,
  } = useAgencySettingStore((state) => ({
    backgroundColor: state.backgroundColor,
    primaryColor: state.primaryColor,
    secondaryColor: state.secondaryColor,
    buttonColor: state.buttonColor,
    tableColor: state.tableColor,
    textColor: state.textColor,
    handlePrimaryColorChange: state.handlePrimaryColorChange,
    handleSecondaryColorChange: state.handleSecondaryColorChange,
    handleBackgroundColorChange: state.handleBackgroundColorChange,
    handleTableColorChange: state.handleTableColorChange,
    handleTextColorChange: state.handleTextColorChange,
    handleButtonColorChange: state.handleButtonColorChange,
  }));
  return (
    <div className="accordion" id="colorPalette">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#primaryColor"
            aria-expanded="false"
            aria-controls="primaryColor"
          >
            <div className="d-flex align-items-center justify-content-between w-100 me-2">
              <span className={brandStyle.title}>Primary</span>
              <input
                type="color"
                readOnly={true}
                value={primaryColor?.main || ""}
                className={brandStyle.colorPicker}
              />
            </div>
          </button>
        </h2>
        <div
          id="primaryColor"
          className="accordion-collapse collapse show"
          data-bs-parent="#colorPalette"
        >
          <div className="accordion-body d-flex flex-column">
            <span className={brandStyle.colorCategory}>Main</span>
            <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
              <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                <input
                  type="color"
                  onChange={handlePrimaryColorChange}
                  className={brandStyle.colorPicker}
                  value={primaryColor?.main || ""}
                />
                <span className={brandStyle.colorCode}>
                  {primaryColor?.main}
                </span>
              </div>
              <button className={brandStyle.resetBtn}>Reset</button>
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#secondaryColor"
            aria-expanded="false"
            aria-controls="secondaryColor"
          >
            <div className="d-flex align-items-center justify-content-between w-100 me-2">
              <span className={brandStyle.title}>Secondary</span>
              <input
                type="color"
                readOnly={true}
                value={secondaryColor?.main || ""}
                className={brandStyle.colorPicker}
              />
            </div>
          </button>
        </h2>
        <div
          id="secondaryColor"
          className="accordion-collapse collapse show"
          data-bs-parent="#colorPalette"
        >
          <div className="accordion-body d-flex flex-column">
            <span className={brandStyle.colorCategory}>Main</span>
            <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
              <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                <input
                  type="color"
                  value={secondaryColor?.main || ""}
                  onChange={handleSecondaryColorChange}
                  className={brandStyle.colorPicker}
                />
                <span className={brandStyle.colorCode}>
                  {secondaryColor?.main}
                </span>
              </div>
              <button className={brandStyle.resetBtn}>Reset</button>
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#backgroundColor"
            aria-expanded="false"
            aria-controls="backgroundColor"
          >
            <div className="d-flex align-items-center justify-content-between w-100 me-2">
              <span className={brandStyle.title}>Background</span>
              <div>
                <input
                  type="color"
                  readOnly={true}
                  value={backgroundColor?.default || ""}
                  className={brandStyle.colorPicker}
                  style={{ marginRight: "5px" }}
                />
                <input
                  type="color"
                  readOnly={true}
                  value={backgroundColor?.card || ""}
                  className={brandStyle.colorPicker}
                  style={{ marginRight: "5px" }}
                />
                <input
                  type="color"
                  readOnly={true}
                  value={backgroundColor?.sidebar || ""}
                  className={brandStyle.colorPicker}
                />
              </div>
            </div>
          </button>
        </h2>
        <div
          id="backgroundColor"
          className="accordion-collapse collapse show"
          data-bs-parent="#colorPalette"
        >
          <div className="accordion-body d-flex flex-column">
            <div>
              <span className={brandStyle.colorCategory}>Default</span>
              <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
                <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                  <input
                    type="color"
                    name="default"
                    value={backgroundColor?.default || ""}
                    onChange={handleBackgroundColorChange}
                    className={brandStyle.colorPicker}
                  />
                  <span className={brandStyle.colorCode}>
                    {backgroundColor?.default}
                  </span>
                </div>
                <button className={brandStyle.resetBtn}>Reset</button>
              </div>
            </div>
            <div>
              <span className={brandStyle.colorCategory}>Card</span>
              <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
                <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                  <input
                    type="color"
                    name="card"
                    value={backgroundColor?.card || ""}
                    onChange={handleBackgroundColorChange}
                    className={brandStyle.colorPicker}
                  />
                  <span className={brandStyle.colorCode}>
                    {backgroundColor?.card}
                  </span>
                </div>
                <button className={brandStyle.resetBtn}>Reset</button>
              </div>
            </div>
            <div>
              <span className={brandStyle.colorCategory}>Sidebar</span>
              <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
                <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                  <input
                    type="color"
                    name="sidebar"
                    onChange={handleBackgroundColorChange}
                    className={brandStyle.colorPicker}
                    value={backgroundColor?.sidebar || ""}
                  />
                  <span className={brandStyle.colorCode}>
                    {backgroundColor?.sidebar}
                  </span>
                </div>
                <button className={brandStyle.resetBtn}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#tableColor"
            aria-expanded="false"
            aria-controls="tableColor"
          >
            <div className="d-flex align-items-center justify-content-between w-100 me-2">
              <span className={brandStyle.title}>Table</span>
              <div>
                <input
                  type="color"
                  readOnly={true}
                  value={tableColor?.background || ""}
                  className={brandStyle.colorPicker}
                  style={{ marginRight: "5px" }}
                />
                <input
                  type="color"
                  readOnly={true}
                  value={tableColor?.selectedRow || ""}
                  className={brandStyle.colorPicker}
                />
              </div>
            </div>
          </button>
        </h2>
        <div
          id="tableColor"
          className="accordion-collapse collapse show"
          data-bs-parent="#colorPalette"
        >
          <div className="accordion-body d-flex flex-column">
            <div>
              <span className={brandStyle.colorCategory}>Table Background</span>
              <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
                <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                  <input
                    type="color"
                    name="background"
                    onChange={handleTableColorChange}
                    className={brandStyle.colorPicker}
                    value={tableColor?.background || ""}
                  />
                  <span className={brandStyle.colorCode}>
                    {tableColor?.background}
                  </span>
                </div>
                <button className={brandStyle.resetBtn}>Reset</button>
              </div>
            </div>
            <div>
              <span className={brandStyle.colorCategory}>Selected Row</span>
              <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
                <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                  <input
                    type="color"
                    name="selectedRow"
                    onChange={handleTableColorChange}
                    className={brandStyle.colorPicker}
                    value={tableColor?.selectedRow || ""}
                  />
                  <span className={brandStyle.colorCode}>
                    {tableColor?.selectedRow}
                  </span>
                </div>
                <button className={brandStyle.resetBtn}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#textColor"
            aria-expanded="false"
            aria-controls="textColor"
          >
            <div className="d-flex align-items-center justify-content-between w-100 me-2">
              <span className={brandStyle.title}>Text</span>
              <div>
                <input
                  type="color"
                  readOnly={true}
                  value={textColor?.primary || ""}
                  className={brandStyle.colorPicker}
                  style={{ marginRight: "5px" }}
                />
                <input
                  type="color"
                  readOnly={true}
                  value={textColor?.secondary || ""}
                  className={brandStyle.colorPicker}
                  style={{ marginRight: "5px" }}
                />
                <input
                  type="color"
                  readOnly={true}
                  value={textColor?.hint || ""}
                  className={brandStyle.colorPicker}
                  style={{ marginRight: "5px" }}
                />
                <input
                  type="color"
                  readOnly={true}
                  value={textColor?.warning || ""}
                  className={brandStyle.colorPicker}
                />
              </div>
            </div>
          </button>
        </h2>
        <div
          id="textColor"
          className="accordion-collapse collapse show"
          data-bs-parent="#colorPalette"
        >
          <div className="accordion-body d-flex flex-column">
            <div>
              <span className={brandStyle.colorCategory}>Primary</span>
              <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
                <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                  <input
                    type="color"
                    name="primary"
                    onChange={handleTextColorChange}
                    className={brandStyle.colorPicker}
                    value={textColor?.primary || ""}
                  />
                  <span className={brandStyle.colorCode}>
                    {textColor?.primary}
                  </span>
                </div>
                <button className={brandStyle.resetBtn}>Reset</button>
              </div>
            </div>
            <div>
              <span className={brandStyle.colorCategory}>Secondary</span>
              <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
                <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                  <input
                    type="color"
                    name="secondary"
                    onChange={handleTextColorChange}
                    className={brandStyle.colorPicker}
                    value={textColor?.secondary || ""}
                  />
                  <span className={brandStyle.colorCode}>
                    {textColor?.secondary}
                  </span>
                </div>
                <button className={brandStyle.resetBtn}>Reset</button>
              </div>
            </div>
            <div>
              <span className={brandStyle.colorCategory}>Hint</span>
              <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
                <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                  <input
                    type="color"
                    name="hint"
                    onChange={handleTextColorChange}
                    className={brandStyle.colorPicker}
                    value={textColor?.hint || ""}
                  />
                  <span className={brandStyle.colorCode}>
                    {textColor?.hint}
                  </span>
                </div>
                <button className={brandStyle.resetBtn}>Reset</button>
              </div>
            </div>
            <div>
              <span className={brandStyle.colorCategory}>Warning Text</span>
              <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
                <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                  <input
                    type="color"
                    name="warning"
                    onChange={handleTextColorChange}
                    className={brandStyle.colorPicker}
                    value={textColor?.warning || ""}
                  />
                  <span className={brandStyle.colorCode}>
                    {textColor?.warning}
                  </span>
                </div>
                <button className={brandStyle.resetBtn}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#buttonColor"
            aria-expanded="false"
            aria-controls="buttonColor"
          >
            <div className="d-flex align-items-center justify-content-between w-100 me-2">
              <span className={brandStyle.title}>Button</span>
              <div>
                <input
                  type="color"
                  readOnly={true}
                  value={buttonColor?.main || ""}
                  className={brandStyle.colorPicker}
                  style={{ marginRight: "5px" }}
                />
                <input
                  type="color"
                  readOnly={true}
                  value={buttonColor?.contrastText || ""}
                  className={brandStyle.colorPicker}
                />
              </div>
            </div>
          </button>
        </h2>
        <div
          id="buttonColor"
          className="accordion-collapse collapse show"
          data-bs-parent="#colorPalette"
        >
          <div className="accordion-body d-flex flex-column">
            <div>
              <span className={brandStyle.colorCategory}>Main</span>
              <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
                <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                  <input
                    type="color"
                    name="main"
                    onChange={handleButtonColorChange}
                    className={brandStyle.colorPicker}
                    value={buttonColor?.main || ""}
                  />
                  <span className={brandStyle.colorCode}>
                    {buttonColor?.main}
                  </span>
                </div>
                <button className={brandStyle.resetBtn}>Reset</button>
              </div>
            </div>
            <div>
              <span className={brandStyle.colorCategory}>Contrast Text</span>
              <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
                <div className="d-flex align-items-center gap-2 border-bottom pb-2 w-75">
                  <input
                    type="color"
                    name="contrastText"
                    onChange={handleButtonColorChange}
                    className={brandStyle.colorPicker}
                    value={buttonColor?.contrastText || ""}
                  />
                  <span className={brandStyle.colorCode}>
                    {buttonColor?.contrastText}
                  </span>
                </div>
                <button className={brandStyle.resetBtn}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
