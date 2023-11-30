import PropTypes from "prop-types";
import { useState, useMemo, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// mock
import { _purchaseAddressFrom } from "src/_mock/arrays";
// components
import FormProvider from "src/components/hook-form";
//
import InvoiceNewEditDetails from "./InvoiceNewEditDetails";
import { useParams } from "react-router";
import { fileToBase64 } from "src/utils";
import PurchaseInvoice from "src/controller/purchase/PurchaseInvoice.controller";

// ----------------------------------------------------------------------
InvoiceNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPurchase: PropTypes.object,
};

export default function InvoiceNewEditForm({ isEdit, currentPurchase }) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const NewUserSchema = Yup.object().shape({
    purchaseOrderId: Yup.string()
      .nullable()
      .required("Choose a purchase order"),
    comment: Yup.string().nullable().required("Comment is required"),
    invoiceApprover: Yup.string()
      .nullable()
      .required("Please choose a invoice approver "),
  });

  const defaultValues = {
    purchaseOrderId: "",
    comment: "",
    invoiceApprover: "",
    items: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const handleSaveAsDraft = () => {
    reset();
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.purchase.invoice.root);
  };

  const { id } = useParams();

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    if (data.cover != undefined) {
      try {
        data.thumbnail = await fileToBase64(data.cover);
        delete data.cover;
      } catch (error) {
        if (data.cover.preview != "") {
          data.thumbnail = data.cover.preview;
        } else {
          window.Toast("Something went wrong with cover picture");
          return false;
        }
      }
    }

    delete data.totalPrice;
    delete data.cover;
    delete data.items;

    if (data.id) {
      PurchaseInvoice.update(data)
        .then((res) => {
          reset();
          setLoadingSend(false);
          navigate(PATH_DASHBOARD.purchase.invoice.root);
          window.Toast("Purchase invoice updated");
        })
        .catch((err) => {
          window.Toast(err.message);
          setLoadingSend(false);
        });
    } else {
      PurchaseInvoice.create(data)
        .then((res) => {
          reset();
          setLoadingSend(false);
          navigate(PATH_DASHBOARD.purchase.invoice.root);
          window.Toast("Purchase invoice created");
        })
        .catch((err) => {
          window.Toast(err.message);
          setLoadingSend(false);
        });
    }
  };

  useEffect(() => {
    if (id) {
      PurchaseInvoice.get(id)
        .then((res) => {
          reset({
            id: res.id,
            purchaseOrderId: res.purchaseOrderId,
            invoiceApprover: res.invoiceApprover,
            comment: res.comment,
          });

          if (res.thumbnail) {
            setValue("cover", {
              preview: res.thumbnail,
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceNewEditDetails />
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {id ? "Update" : "Add "}
        </LoadingButton>

        <LoadingButton
          color="error"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Cancel
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
