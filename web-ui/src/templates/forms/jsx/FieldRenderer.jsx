"use client";

// FieldRenderer.jsx
import { TextField } from "../../../InputFields/TextInput/jsx/TextField.jsx";
import { TextArea } from "../../../InputFields/TextInput/jsx/TextArea.jsx";
import { EmailField } from "../../../InputFields/CommunicationInput/jsx/EmailInput.jsx";
import { MobileField } from "../../../InputFields/CommunicationInput/jsx/MobileInput.jsx";
import { PasswordField } from "../../../InputFields/Security/jsx/PasswordField.jsx";
import { DatePicker } from "../../../InputFields/DateTimeInput/jsx/DatePicker.jsx";
import { TimePicker } from "../../../InputFields/DateTimeInput/jsx/TimePicker.jsx";
import { AddressField } from "../../../InputFields/Location/jsx/AddressField.jsx";
import { Dropdown } from "../../../InputFields/Selectors/jsx/Dropdown.jsx";
import { FORM_FIELDS_TYPE } from "../validation/helper/fields.js";
import { RepeatableGroup } from "./RepeatableGroup.jsx";
import { FileUpload } from "../../../InputFields/Uploads/jsx/FileUpload.jsx";
import { isConditional } from "../validation/isConditional.js";
import { AudioUpload } from "../../../InputFields/Uploads/jsx/AudioUpload.jsx";
import { ImageUpload } from "../../../InputFields/Uploads/jsx/ImageUpload.jsx";
import { VideoUpload } from "../../../InputFields/Uploads/jsx/VideoUpload.jsx";
import { SecurityQuestion } from "../../../InputFields/Security/jsx/SecurityQuestion.jsx";
import { OtpField } from "../../../InputFields/Security/jsx/OtpField.jsx";
import { CheckboxGroup } from "../../../InputFields/Selectors/jsx/CheckboxGroup.jsx";
import { ColorPicker } from "../../../InputFields/Selectors/jsx/ColorPicker.jsx";
import { RadioGroup } from "../../../InputFields/Selectors/jsx/RadioGroup.jsx";
import { SearchBox } from "../../../InputFields/Selectors/jsx/SearchBox.jsx";
import { Switch } from "../../../InputFields/Selectors/jsx/Switch.jsx";
import { Slider } from "../../../InputFields/NumericInput.jsx/jsx/Slider.jsx";
import { JsonField } from "../../../InputFields/TextInput/jsx/JsonField.jsx";
import { Stepper } from "../../../InputFields/NumericInput.jsx/jsx/Stepper.jsx";
import { FIELDS_PROPS as FPs } from "../validation/helper/fields.js";
import { UrlTextField } from "../../../InputFields/TextInput/jsx/UrlTextField.jsx";

/**
 * FieldRenderer Component
 *
 * Dynamically renders a form field based on its configuration.
 *
 * Props:
 * @param {Object} field - Configuration object for the field (type, label, conditional logic, etc.).
 * @param {*} value - Current value of the field.
 * @param {Function} onChange - Callback function to update the field's value.
 * @param {Object} settings - Additional settings or context for rendering the field.
 *
 * Notes:
 * - If `field.conditional` is defined, the field is only rendered when the condition passes.
 * - The function `isConditional(field, value)` is used to evaluate the conditional logic.
 */

export function FieldRenderer({ field, value, onChange, settings }) {
  // Conditional rendering
  if (field.conditional) {
    const isMatch = isConditional(field, value);
    if (!isMatch) return null;
  }

  const color = settings.color;
  const width = "100%";

  // Repeatable group
  if (field[FPs.REPEATABLE]) {
    return (
      <RepeatableGroup
        field={field}
        values={value[field[FPs.NAME]] || [{}]}
        onChange={(v, isError) => onChange(field[FPs.NAME], v, isError)}
        settings={settings}
      />
    );
  }

  const fieldMap = {
    [FORM_FIELDS_TYPE.DROPDOWN]: (
      <Dropdown
        width={width}
        color={color}
        key={field[FPs.NAME]}
        label={field[FPs.LABEL]}
        placeholder={field[FPs.PLACEHOLDER] || field[FPs.LABEL]}
        showLabelAlways={settings.showLabelAlways}
        options={field[FPs.OPTIONS] || []}
        required={field?.[FPs.REQUIRED] || false}
        value={value[field[FPs.NAME]]}
        multiple={false}
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }} // Update state on change
      />
    ),
    [FORM_FIELDS_TYPE.MULTI_DROPDOWN]: (
      <Dropdown
        width={width}
        color={color}
        key={field[FPs.NAME]}
        label={field[FPs.LABEL]}
        placeholder={field[FPs.PLACEHOLDER] || field[FPs.LABEL]}
        showLabelAlways={settings.showLabelAlways}
        options={field[FPs.OPTIONS] || []}
        value={value[field[FPs.NAME]]}
        required={field?.[FPs.REQUIRED] || false}
        multiple={true}
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }} // Update state on change
      />
    ),
    [FORM_FIELDS_TYPE.EMAIL]: (
      <EmailField
        width={width}
        color={color}
        key={field[FPs.NAME]}
        label={field[FPs.LABEL]}
        required={field?.[FPs.REQUIRED] || false}
        placeholder={field[FPs.PLACEHOLDER] || field[FPs.LABEL]}
        value={value[field[FPs.NAME]]}
        setResult={(v) => onChange(field[FPs.NAME], v)} // Update state on change
        setIsFieldValid={(v) => onChange(field[FPs.NAME], v, true)}
        showLabelAlways={settings.showLabelAlways}
      />
    ),
    [FORM_FIELDS_TYPE.PASSWORD]: (
      <PasswordField
        width={width}
        color={color}
        key={field[FPs.NAME]}
        label={field[FPs.LABEL]}
        placeholder={field[FPs.PLACEHOLDER] || field[FPs.LABEL]}
        required={field?.[FPs.REQUIRED] || false}
        value={value[field[FPs.NAME]]}
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }} // Update state on change
        showLabelAlways={settings.showLabelAlways}
      />
    ),
    [FORM_FIELDS_TYPE.MOBILE]: (
      <MobileField
        width={width}
        color={color}
        key={field[FPs.NAME]}
        label={field[FPs.LABEL]}
        required={field?.[FPs.REQUIRED] || false}
        placeholder={field[FPs.PLACEHOLDER] || field[FPs.LABEL]}
        value={value[field[FPs.NAME]]?.[FPs.NUMBER]}
        code={value[field[FPs.NAME]]?.[FPs.CODE]}
        setResult={(v) => {
          const val = {
            [FPs.CODE]: v.countryCode,
            [FPs.NUMBER]: v.phoneNumber,
          };
          onChange(field[FPs.NAME], val);
        }} // Update state on change
        showLabelAlways={settings.showLabelAlways}
        setIsFieldValid={(v) => onChange(field[FPs.NAME], v, true)}
      />
    ),
    [FORM_FIELDS_TYPE.DATE]: (
      <DatePicker
        width={width}
        color={color}
        key={field[FPs.NAME]}
        label={field[FPs.LABEL]}
        required={field?.[FPs.REQUIRED] || false}
        initialDate={value[field[FPs.NAME]] || field[FPs.VALUE]}
        restrictionStartDate={field[FPs.RESTRICTION_START_DATE]}
        restrictionEndDate={field[FPs.RESTRICTION_END_DATE]}
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }} // Update state on change
        mode={field[FPs.MODE]}
      />
    ),
    [FORM_FIELDS_TYPE.TIME]: (
      <TimePicker
        key={field[FPs.NAME]}
        color={color}
        label={field[FPs.LABEL]}
        required={field?.[FPs.REQUIRED] || false}
        value={value[field[FPs.NAME]]}
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }} // Update state on change
      />
    ),
    [FORM_FIELDS_TYPE.ADDRESS]: (
      <AddressField
        width={width}
        color={color}
        key={field[FPs.NAME]}
        setResult={(v) => onChange(field[FPs.NAME], v)}
        isHouse={field[FPs.IS_HOUSE]}
        isStreet={field[FPs.IS_STREET]}
        isCity={field[FPs.IS_CITY]}
        isState={field[FPs.IS_STATE]}
        isPostal={field[FPs.IS_POSTAL]}
        isCountry={field[FPs.IS_COUNTRY]}
        isAddressLine={field[FPs.IS_ADDRESS_LINE]}
        isLandmark={field[FPs.IS_LANDMARK]}
        values={value[field[FPs.NAME]]}
        showLabelAlways={settings.showLabelAlways}
        setIsFieldValid={(v) => onChange(field[FPs.NAME], v, true)}
        gap={settings.gap}
      />
    ),
    [FORM_FIELDS_TYPE.TEXT]: (
      <TextField
        key={field[FPs.NAME]}
        label={field[FPs.LABEL]}
        placeholder={field[FPs.PLACEHOLDER] || field[FPs.LABEL]}
        name={field[FPs.NAME]}
        value={value[field[FPs.NAME]]}
        setResult={(v) => onChange(field[FPs.NAME], v)} // Update state on change
        width={width}
        color={color}
        showLabelAlways={settings.showLabelAlways}
        required={field?.[FPs.REQUIRED] || false}
        setIsFieldValid={(v) => onChange(field[FPs.NAME], v, true)}
      />
    ),
    [FORM_FIELDS_TYPE.URL]: (
      <UrlTextField
        key={field[FPs.NAME]}
        label={field[FPs.LABEL]}
        placeholder={field[FPs.PLACEHOLDER] || field[FPs.LABEL]}
        name={field[FPs.NAME]}
        value={value[field[FPs.NAME]]}
        setResult={(v) => onChange(field[FPs.NAME], v)} // Update state on change
        width={width}
        color={color}
        showLabelAlways={settings.showLabelAlways}
        required={field?.[FPs.REQUIRED] || false}
        setIsFieldValid={(v) => onChange(field[FPs.NAME], v, true)}
      />
    ),
    [FORM_FIELDS_TYPE.TEXT_AREA]: (
      <TextArea
        width={width}
        key={field[FPs.NAME]}
        showLabelAlways={settings.showLabelAlways}
        value={value[field[FPs.NAME]]}
        label={field[FPs.LABEL]}
        setResult={(v) => onChange(field[FPs.NAME], v)} // Update state on change
        color={color}
        placeholder={field[FPs.PLACEHOLDER] || field[FPs.LABEL]}
        minLength={field[FPs.MIN_LENGTH]}
        maxLength={field[FPs.MAX_LENGTH]}
        maxTextAreaHeight={field[FPs.MAX_TEXTAREA_HEIGHT]}
        showCharacterCount={field[FPs.SHOW_CHARACTER_COUNT]}
        showWordCount={field[FPs.SHOW_WORD_COUNT]}
        required={field?.[FPs.REQUIRED] || false}
        disabled={field[FPs.DISABLED]}
        setIsFieldValid={(v) => onChange(field[FPs.NAME], v, true)}
      />
    ),
    [FORM_FIELDS_TYPE.JSON]: (
      <JsonField
        width={width}
        color={color}
        label={field[FPs.LABEL]}
        setResult={(v) => onChange(field[FPs.NAME], v)} // Update state on change
        showCharacterCount={field[FPs.SHOW_CHARACTER_COUNT]}
        showWordCount={field[FPs.SHOW_WORD_COUNT]}
        setIsFieldValid={(v) => onChange(field[FPs.NAME], v, true)}
        hideOnSave={field[FPs.HIDE_ON_SAVE]}
        isBorder={field[FPs.IS_BORDER]}
        required={field?.[FPs.REQUIRED] || false}
        value={value[field[FPs.NAME]]}
      />
    ),
    [FORM_FIELDS_TYPE.FILE]: (
      <FileUpload
        value={value[field[FPs.NAME]] || []}
        label={field[FPs.LABEL]}
        width={width}
        multiple={field[FPs.MULTIPLE]}
        maxFiles={field[FPs.MAX_FILES]}
        color={color}
        maxSize={field[FPs.MAX_SIZE_MB]}
        allowedTypes={field[FPs.ALLOWED_TYPES]}
        height={field[FPs.HEIGHT] || "200px"}
        setResult={(v) => onChange(field[FPs.NAME], v)}
        setIsFieldValid={(v) => onChange(field[FPs.NAME], v, true)}
        required={field?.[FPs.REQUIRED] || false}
      />
    ),
    [FORM_FIELDS_TYPE.AUDIO]: (
      <AudioUpload
        label={field[FPs.LABEL]}
        width={width}
        height={field[FPs.HEIGHT] || "100px"}
        maxSize={field[FPs.MAX_SIZE_MB]}
        allowedTypes={field[FPs.ALLOWED_TYPES]}
        setResult={(v) => onChange(field[FPs.NAME], v)}
        value={value[field[FPs.NAME]]}
        color={color}
        setIsFieldValid={(v) => onChange(field[FPs.NAME], v, true)}
        required={field?.[FPs.REQUIRED] || false}
      />
    ),
    [FORM_FIELDS_TYPE.IMAGE]: (
      <ImageUpload
        label={field[FPs.LABEL]}
        width={width}
        height={field[FPs.HEIGHT] || "100px"}
        value={value[field[FPs.NAME]]}
        maxSize={field[FPs.MAX_SIZE_MB]}
        allowedTypes={field[FPs.ALLOWED_TYPES]}
        requireSquare={field[FPs.REQUIRE_SQUARE]}
        previewBorderRadius={field[FPs.PREVIEW_BORDER_RADIUS]}
        setResult={(v) => onChange(field[FPs.NAME], v)}
        color={color}
        setIsFieldValid={(v) => onChange(field[FPs.NAME], v, true)}
        required={field?.[FPs.REQUIRED] || false}
      />
    ),
    [FORM_FIELDS_TYPE.VIDEO]: (
      <VideoUpload
        label={field[FPs.LABEL]}
        width={width}
        height={field[FPs.HEIGHT] || "100px"}
        maxSize={field[FPs.MAX_SIZE_MB]}
        allowedTypes={field[FPs.ALLOWED_TYPES]}
        preview={field[FPs.PREVIEW]}
        value={value[field[FPs.NAME]]}
        setResult={(v) => onChange(field[FPs.NAME], v)}
        color={color}
        setIsFieldValid={(v) => onChange(field[FPs.NAME], v, true)}
        required={field?.[FPs.REQUIRED] || false}
      />
    ),
    [FORM_FIELDS_TYPE.SECURTY_QUESTION]: (
      <SecurityQuestion
        questions={field[FPs.OPTIONS]}
        placeholder={field[FPs.LABEL] || field[FPs.PLACEHOLDER]}
        width={width}
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }}
        color={color}
        value={value[field[FPs.NAME]]}
        required={field?.[FPs.REQUIRED] || false}
      />
    ),
    [FORM_FIELDS_TYPE.OTP]: (
      <OtpField
        width={width}
        setResult={(v) => onChange(field[FPs.NAME], v)}
        color={color}
        length={field[FPs.LENGTH]}
        verifcationEndpoint={field[FPs.VERIFICATION_ENDPOINT]}
        userId={field[FPs.USER_ID]}
        // setError={() => {}}
        isNumeric={field[FPs.IS_NUMERIC]}
      />
    ),
    [FORM_FIELDS_TYPE.CHECKBOX]: (
      <CheckboxGroup
        width={width}
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }}
        color={color}
        options={field[FPs.OPTIONS]}
        initialSelectedValues={value[field[FPs.NAME]]}
        layout={field[FPs.LAYOUT]}
        label={field[FPs.LABEL]}
        disabled={field[FPs.DISABLED]}
        required={field?.[FPs.REQUIRED] || false}
      />
    ),
    [FORM_FIELDS_TYPE.COLOR]: (
      <ColorPicker
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }}
        color={value[field[FPs.NAME]] || field[FPs.COLOR] || "#ff5969"}
        required={field?.[FPs.REQUIRED] || false}
      />
    ),
    [FORM_FIELDS_TYPE.RADIO]: (
      <RadioGroup
        width={width}
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }}
        color={color}
        options={field[FPs.OPTIONS]}
        initialSelectedValue={value[field[FPs.NAME]]}
        layout={field[FPs.LAYOUT]}
        label={field[FPs.LABEL]}
        disabled={field[FPs.DISABLED]}
        required={field?.[FPs.REQUIRED] || false}
      />
    ),
    [FORM_FIELDS_TYPE.SEARCH]: (
      <SearchBox
        placeholder={field[FPs.LABEL] || field[FPs.PLACEHOLDER]}
        width={width}
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }}
        color={color}
        suggestions={field[FPs.OPTIONS]}
        required={field?.[FPs.REQUIRED] || false}
      />
    ),
    [FORM_FIELDS_TYPE.SWITCH]: (
      <Switch
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }}
        color={color}
        initialValue={value[field[FPs.NAME]]}
        label={field[FPs.LABEL]}
        disabled={field[FPs.DISABLED]}
        required={field?.[FPs.REQUIRED] || false}
      />
    ),
    [FORM_FIELDS_TYPE.SLIDER]: (
      <Slider
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }}
        color={color}
        label={field[FPs.LABEL]}
        value={value[field[FPs.NAME]]}
        min={field[FPs.MIN]}
        max={field[FPs.MAX]}
        step={field[FPs.STEP]}
        showRange={field[FPs.SHOW_RANGE]}
        showValueSide={field[FPs.SHOW_VALUE_SIDE]}
        precision={field[FPs.PRECISION]}
        width={width}
        required={field?.[FPs.REQUIRED] || false}
      />
    ),
    [FORM_FIELDS_TYPE.STEPPER]: (
      <Stepper
        setResult={(v) => {
          onChange(field[FPs.NAME], v);
          onChange(field[FPs.NAME], true, true); // to update Error State as valid
        }}
        color={color}
        width={width}
        label={field[FPs.LABEL]}
        value={value[field[FPs.NAME]]}
        min={field[FPs.MIN]}
        max={field[FPs.MAX]}
        step={field[FPs.STEP]}
        required={field?.[FPs.REQUIRED] || false}
      />
    ),
  };

  return fieldMap[field[FPs.TYPE]] || null;
}
