import { Field } from "./Field";
import styles from "../css/FieldSection.module.css";
import { FieldSectionHeader } from "./FieldSectionHeader";

export function FieldSection({ header, fields = [] }) {
  return (
    <section className={styles.section}>
      <FieldSectionHeader header={header} />

      <div className={styles.grid}>
        {fields.map((field) => (
          <Field
            key={field.id}
            leftIcon={field.leftIcon}
            title={field.title}
            value={field.value}
            badges={field.badges}
          />
        ))}
      </div>
    </section>
  );
}
