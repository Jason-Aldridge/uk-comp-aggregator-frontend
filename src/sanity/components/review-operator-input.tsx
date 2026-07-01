import { useEffect, useMemo, useState } from "react";
import { Card, Flex, Select, Spinner, Text } from "@sanity/ui";
import { FormField, set, unset, type StringInputProps } from "sanity";

type OperatorOption = {
  id: string;
  name: string;
};

function normalizeOperators(value: unknown): OperatorOption[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];

    const data = item as {
      id?: string;
      name?: string;
    };

    if (!data.id || !data.name) return [];

    return [{ id: data.id, name: data.name }];
  });
}

export function ReviewOperatorInput(props: StringInputProps) {
  const { value, elementProps, onChange, renderDefault } = props;
  const [options, setOptions] = useState<OperatorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    let cancelled = false;

    async function loadOperators() {
      if (!apiUrl) {
        if (!cancelled) {
          setError("Missing NEXT_PUBLIC_API_URL");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${apiUrl}/operators`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = (await response.json()) as unknown;
        const normalized = normalizeOperators(json).sort((a, b) =>
          a.name.localeCompare(b.name, "en-GB"),
        );

        if (!cancelled) {
          setOptions(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load operators",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOperators();

    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const selectedOperator = useMemo(() => {
    return options.find((option) => option.id === value) ?? null;
  }, [options, value]);

  const handleChange = (nextValue: string) => {
    onChange(nextValue ? set(nextValue) : unset());
  };

  return (
    <FormField
      title={props.schemaType.title}
      description={props.schemaType.description}
      __unstable_markers={props.markers}
      __unstable_presence={props.presence}
      validation={props.validation}
    >
      <Card padding={3} radius={2} border>
        <Flex direction="column" gap={3}>
          {loading ? (
            <Flex align="center" gap={2}>
              <Spinner muted />
              <Text size={1}>Loading operators…</Text>
            </Flex>
          ) : null}

          {!loading && !error ? (
            <Select
              {...elementProps}
              value={typeof value === "string" ? value : ""}
              onChange={(event) => handleChange(event.currentTarget.value)}
            >
              <option value="">Select operator</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </Select>
          ) : null}

          {selectedOperator ? (
            <Text size={1} muted>
              Selected: {selectedOperator.name}
            </Text>
          ) : null}

          {error ? (
            <Flex direction="column" gap={3}>
              <Text size={1} tone="critical">
                Failed to load operators: {error}
              </Text>
              {renderDefault(props)}
            </Flex>
          ) : null}
        </Flex>
      </Card>
    </FormField>
  );
}
