import { useState, useEffect, useCallback } from "react";
import type { FC } from "react";
import {
  FormField,
  FormFieldLabel,
  FormFieldHelperText,
  Input,
  Dropdown,
  Option,
  Button,
  StackLayout,
  Panel,
  Text,
  FlowLayout,
} from "@salt-ds/core";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { TradeEvent } from "../app/use-positions";
import { usePositions } from "../app/use-positions";

interface ValidationState {
  Account: "error" | undefined;
  Security: "error" | undefined;
  Quantity: "error" | undefined;
}

const CreateEvent: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<TradeEvent, "ID">>({
    Action: "BUY",
    Account: "",
    Security: "",
    Quantity: 0,
  });
  const [validation, setValidation] = useState<ValidationState>({
    Account: undefined,
    Security: undefined,
    Quantity: undefined,
  });
  const { data: positions } = usePositions();
  const [touched, setTouched] = useState({
    Account: false,
    Security: false,
    Quantity: false,
  });

  const validateForm = useCallback(() => {
    const newValidation: ValidationState = {
      Account: undefined,
      Security: undefined,
      Quantity: undefined,
    };

    // Only validate if field has been touched
    if (touched.Account && !formData.Account) {
      newValidation.Account = "error";
    }

    if (touched.Security && !formData.Security) {
      newValidation.Security = "error";
    }

    if (touched.Quantity && formData.Quantity <= 0) {
      newValidation.Quantity = "error";
    }

    // Special validation for CANCEL action
    if (formData.Action === "CANCEL" && (touched.Account || touched.Security)) {
      const positionExists = positions?.some(
        (pos) =>
          pos.Account === formData.Account && pos.Security === formData.Security
      );
      if (!positionExists) {
        newValidation.Account = "error";
        newValidation.Security = "error";
      }
    }

    setValidation(newValidation);
  }, [formData, positions, touched]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const isFormValid = () => {
    return (
      formData.Account &&
      formData.Security &&
      formData.Quantity > 0 &&
      (formData.Action !== "CANCEL" ||
        positions?.some(
          (pos) =>
            pos.Account === formData.Account &&
            pos.Security === formData.Security
        ))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/api/trades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Events: [
            {
              ...formData,
              ID: Date.now().toString(),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      // Invalidate and refetch positions data
      await queryClient.invalidateQueries({ queryKey: ["positions"] });
      navigate("/");
    } catch (error) {
      console.error("Error creating event:", error);
      // TODO: Add error handling UI
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StackLayout
      align="center"
      gap={5}
      style={{
        minHeight: "100%",
        width: "100%",
        background: "var(--salt-container-primary-background)",
      }}
    >
      <StackLayout
        align="center"
        style={{
          width: "100%",
          maxWidth: 600,
          margin: "0 auto",
          padding: "var(--salt-spacing-400) 0",
        }}
      >
        <Text styleAs="h1" style={{ marginBottom: "var(--salt-spacing-300)" }}>
          Create Trade Event
        </Text>
        <Panel
          variant="primary"
          style={{
            width: "100%",
            padding: "var(--salt-spacing-300)",
            boxSizing: "border-box",
            boxShadow: "var(--salt-overlayable-shadow-scroll)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <StackLayout gap={3}>
              <FormField>
                <FormFieldLabel>Action</FormFieldLabel>
                <Dropdown
                  value={formData.Action}
                  selected={[formData.Action]}
                  onSelectionChange={(_, values) => {
                    const value = values[0];
                    if (value === "BUY" || value === "SELL") {
                      setFormData((prev) => ({ ...prev, Action: value }));
                    }
                  }}
                  aria-label="Action"
                >
                  <Option value="BUY">Buy</Option>
                  <Option value="SELL">Sell</Option>
                </Dropdown>
                <FormFieldHelperText>
                  Select the type of trade action
                </FormFieldHelperText>
              </FormField>

              <FormField>
                <FormFieldLabel>Account</FormFieldLabel>
                <Input
                  value={formData.Account}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTouched((prev) => ({ ...prev, Account: true }));
                    setFormData((prev) => ({
                      ...prev,
                      Account: e.target.value,
                    }));
                  }}
                  validationStatus={validation.Account}
                />
                <FormFieldHelperText>
                  {validation.Account === "error" &&
                  formData.Action === "CANCEL"
                    ? "Account must exist for CANCEL action"
                    : "Enter the account identifier"}
                </FormFieldHelperText>
              </FormField>

              <FormField>
                <FormFieldLabel>Security</FormFieldLabel>
                <Input
                  value={formData.Security}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTouched((prev) => ({ ...prev, Security: true }));
                    setFormData((prev) => ({
                      ...prev,
                      Security: e.target.value,
                    }));
                  }}
                  validationStatus={validation.Security}
                />
                <FormFieldHelperText>
                  {validation.Security === "error" &&
                  formData.Action === "CANCEL"
                    ? "Security must exist for CANCEL action"
                    : "Enter the security identifier"}
                </FormFieldHelperText>
              </FormField>

              <FormField>
                <FormFieldLabel>Quantity</FormFieldLabel>
                <Input
                  value={formData.Quantity.toString()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTouched((prev) => ({ ...prev, Quantity: true }));
                    setFormData((prev) => ({
                      ...prev,
                      Quantity: Number(e.target.value),
                    }));
                  }}
                  validationStatus={validation.Quantity}
                />
                <FormFieldHelperText>
                  {validation.Quantity === "error"
                    ? "Quantity must be greater than 0"
                    : "Enter the quantity of the trade"}
                </FormFieldHelperText>
              </FormField>

              <FlowLayout justify="end" gap={2}>
                <Button onClick={() => navigate("/")} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  sentiment="accented"
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  loading={isSubmitting}
                >
                  Create Event
                </Button>
              </FlowLayout>
            </StackLayout>
          </form>
        </Panel>
      </StackLayout>
    </StackLayout>
  );
};

export default CreateEvent;
