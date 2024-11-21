import React, { useState } from "react";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { cardsData } from "../../data/data";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { BaseButtonGreen } from "../../styles/button"; // Import BaseButtonGreen
import { toast } from "react-hot-toast";

const ShippingPaymentWrapper = styled.div`
  .shipping-addr,
  .shipping-method,
  .payment-method {
    margin: 20px 0;

    &-title {
      margin-bottom: 8px;
    }

    .list-group {
      padding: 24px;
      background-color: ${defaultTheme.color_whitesmoke};
      max-width: 818px;
      margin-top: 24px;
      border-radius: 12px;

      @media (max-width: ${breakpoints.sm}) {
        padding: 16px;
        border-radius: 8px;
        margin-top: 16px;
      }
    }

    .list-group-item {
      column-gap: 20px;
    }
    .horiz-line-separator {
      margin: 20px 0;
      @media (max-width: ${breakpoints.sm}) {
        margin: 12px 0;
      }
    }
  }

  .payment-method {
    .list-group-item {
      &-head {
        column-gap: 20px;
      }
    }

    .payment-cards {
      gap: 20px;
      margin: 24px 0 30px 34px;

      @media (max-width: ${breakpoints.lg}) {
        gap: 16px;
      }

      @media (max-width: ${breakpoints.sm}) {
        margin-top: 16px;
        margin-bottom: 16px;
        gap: 10px;
        margin-left: 0;
      }
      .payment-card {
        position: relative;
        width: 80px;
        height: 46px;
        cursor: pointer;
        border: 2px solid transparent; /* Default border color */

        &.selected {
          border: 2px solid ${defaultTheme.color_sea_green}; /* Selected border color */
        }

        .card-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 5px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          .card-selected {
            display: none;
            transition: ${defaultTheme.default_transition};
          }
        }
      }
    }

    .payment-details {
      margin-left: 34px;
      display: grid;
      row-gap: 16px;

      @media (max-width: ${breakpoints.sm}) {
        margin-left: 0;
      }

      .form-elem-group {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        @media (max-width: ${breakpoints.sm}) {
          grid-template-columns: 100%;
          gap: 0;
        }
      }

      .form-elem {
        height: 40px;
        border: 1px solid ${defaultTheme.color_platinum};
        border-radius: 6px;
        padding: 16px;
        transition: border-color 0.3s;

        &:focus {
          border-color: ${defaultTheme.color_sea_green};
        }

        &.required {
          border-color: red;
        }

        @media (max-width: ${breakpoints.sm}) {
          margin-bottom: 10px;
          border-radius: 4px;
        }
      }

      .error-message {
        color: red;
        font-size: 12px;
      }
    }
  }

  .pay-now-btn {
    @media (max-width: ${breakpoints.sm}) {
      width: 100%;
    }
  }
`;

const validationSchema = Yup.object().shape({
  cardNumber: Yup.string().required("Card number is required"),
  cardName: Yup.string().required("Name on card is required"),
  cardExpiry: Yup.string().required("Expiration date is required"),
  securityCode: Yup.string().required("Security code is required"),
});

const ShippingPayment = ({ setPaymentDetails }) => {
  const [selectedCardName, setSelectedCardName] = useState("");

  const handleCardSelection = (cardId) => {
    setSelectedCardName(cardId);
  };

  const initialValues = {
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    securityCode: "",
  };

  const handleSubmit = (values) => {
    setPaymentDetails(values);
    toast.success("Payment details saved successfully");
  };

  return (
    <ShippingPaymentWrapper>
      <div className="payment-method">
        <h3 className="text-xxl payment-method-title">Payment Method</h3>
        <p className="text-base text-outerspace">
          All transactions are secure and encrypted.
        </p>
        <div className="list-group">
          <div className="list-group-item">
            <div className="flex items-center list-group-item-head">
              <p className="font-semibold text-lg">
                Credit Card
                <span className="flex text-base font-medium text-gray">
                  We accept all major credit cards.
                </span>
              </p>
            </div>
            <div className="payment-cards flex flex-wrap">
              {cardsData?.map((card) => {
                return (
                  <div
                    className={`payment-card flex items-center justify-center ${
                      selectedCardName === card.id ? "selected" : ""
                    }`}
                    key={card.id}
                    onClick={() => handleCardSelection(card.id)}
                  >
                    <div className="card-wrapper bg-white w-full h-full flex items-center justify-center">
                      <img
                        src={card.imgSource}
                        alt={card.id}
                        style={{
                          border: selectedCardName === card.id ? `2px solid ${defaultTheme.color_sea_green}` : "none",
                          borderRadius: "5px",
                        }}
                      />
                      <div className="card-selected text-sea-green">
                        <i className="bi bi-check-circle-fill"></i>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, setFieldValue }) => (
                <Form className="payment-details">
                  <div className="form-elem-group">
                    <div className="input-elem">
                      <Field
                        type="text"
                        name="cardNumber"
                        placeholder="Card number"
                        className={`form-elem ${
                          errors.cardNumber && touched.cardNumber ? "required" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="cardNumber"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="input-elem">
                      <Field
                        type="text"
                        name="cardName"
                        placeholder="Name on card"
                        className={`form-elem ${
                          errors.cardName && touched.cardName ? "required" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="cardName"
                        component="div"
                        className="error-message"
                      />
                    </div>
                  </div>
                  <div className="form-elem-group">
                    <div className="input-elem">
                      <Field
                        type="text"
                        name="cardExpiry"
                        placeholder="Expiration date (MM/YY)"
                        className={`form-elem ${
                          errors.cardExpiry && touched.cardExpiry ? "required" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="cardExpiry"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="input-elem">
                      <Field
                        type="text"
                        name="securityCode"
                        placeholder="Security Code"
                        className={`form-elem ${
                          errors.securityCode && touched.securityCode ? "required" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="securityCode"
                        component="div"
                        className="error-message"
                      />
                    </div>
                  </div>
                  <BaseButtonGreen type="submit">Save Payment Details</BaseButtonGreen>
                </Form>
              )}
            </Formik>
          </div>
          <div className="horiz-line-separator"></div>
        </div>
      </div>
    </ShippingPaymentWrapper>
  );
};

export default ShippingPayment;