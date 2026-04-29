import { GenericForm, type FormConfig } from "@/templates";
import styles from "./PartnershipForm.module.css";
import { useAPICaller } from "@/hooks";
import { ErrorPage, Loading } from "@/atoms";
import { API } from "@/core-ui";

export const PartnershipForm = () => {
  const handleSubmit = (data: Record<string, any>) => {
    console.log("Form Submitted:", data);
    // alert("Form Submitted! Check console.");
  };

  const { response, loading } = useAPICaller<FormConfig>({
    endpoint: API.FORM_API.partnershipConfig("partnership"),
  });

  console.log("DDDD : ", loading, response);

  if (loading) return <Loading />;
  if (!response)
    return <ErrorPage handleNavigate={() => {}} statusCode={500} />;
  if (!response.data) return <ErrorPage handleNavigate={() => {}} />;

  const config: FormConfig = response.data;

  return (
    <div className={styles.partnershipFormWrapper}>
      <div className={styles.partnershipForm}>
        <GenericForm
          config={config}
          onSubmit={handleSubmit}
          submitLabel="Register"
        />
      </div>
    </div>
  );
};
