import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../../routes/paths";
// mock
// components
import FormProvider from "../../../../../components/hook-form";
//
import PurchaseOrder from "src/controller/purchase/PurchaseOrder.controller";
import OrderVerificationDetails from "./OrderVerificationDetails";
// ----------------------------------------------------------------------

OrderVerificationForm.propTypes = {
  isEdit: PropTypes.bool,
  id: PropTypes.string,
};

export default function OrderVerificationForm({ isEdit, id }) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const POApprovalSchema = Yup.object().shape({
    poVerificationComment: Yup.string()
      .nullable()
      .required("Comment is required"),
  });

  const defaultValues = {
    poVerificationComment: "",
    id: id,
  };

  const methods = useForm({
    resolver: yupResolver(POApprovalSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSaveAsDraft = async (data) => {
    setLoadingSend(true);

    PurchaseOrder.update({
      ...data,
      status: "rejected",
      poApproveDate: new Date().toString(),
    })
      .then((res) => {
        reset();
        setLoadingSend(false);
        window.Toast("Purchase Order Rejected", { variant: "error" });
        navigate(PATH_DASHBOARD.purchase.order.root);
      })
      .catch((err) => {
        setLoadingSend(false);
        window.Toast("Something went wrong. Can't reject purchase order");
      });
  };

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    PurchaseOrder.update({
      ...data,
      status: "approved",
      poApproveDate: new Date().toString(),
    })
      .then((res) => {
        reset();
        setLoadingSend(false);

        window.Toast("Purchase Order Approved");
        navigate(PATH_DASHBOARD.purchase.order.root);
      })
      .catch((err) => {
        setLoadingSend(false);
        window.Toast("Something went wrong. Can't Approve Purchase Order");
      });
  };

  return (
    <>
      <FormProvider methods={methods}>
        <Card>
          <OrderVerificationDetails id={id} />
        </Card>

        <Stack
          justifyContent="flex-end"
          direction="row"
          spacing={2}
          sx={{ mt: 3 }}
        >
          <LoadingButton
            size="large"
            // type="submit"
            variant="contained"
            loading={loadingSend && isSubmitting}
            onClick={handleSubmit(handleSaveAsDraft)}
          >
            Submit
          </LoadingButton>

          <LoadingButton
            color="error"
            size="large"
            variant="contained"
            loading={loadingSave && isSubmitting}
            onClick={handleSubmit(handleSaveAsDraft)}
          >
            Reject
          </LoadingButton>
        </Stack>
      </FormProvider>
    </>
  );
}
