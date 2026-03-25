import {
  TestAudioUpload,
  TestCalendar,
  TestDropdown,
  TestGenericForm,
  TestIconGallery,
  TestImageUpload,
  TestJsonField,
  TestSearchBox,
  TestTextArea,
  TestTextInput,
  TestVideoUpload,
} from "./tests";

export function Test() {
  return (
    <>
      <TestImageUpload />
      <TestVideoUpload />
      <TestAudioUpload />
      <TestJsonField />
      <TestTextArea />
      <TestDropdown />
      <TestCalendar />
      <TestTextInput />
      {/* <TestGenericForm /> */}
    </>
  );
}
