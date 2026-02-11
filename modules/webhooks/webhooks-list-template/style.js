import styled from 'styled-components';

export const WebhookModalWrapper = styled.div`
  .modal-header {
    margin-bottom: 20px;

    @media (max-width: 768px) {
      margin-bottom: 16px;
    }

    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .webhook-form {
    .enable-webhook-row {
      margin-bottom: 20px;

      @media (max-width: 768px) {
        margin-bottom: 16px;
      }

      @media (max-width: 576px) {
        margin-bottom: 12px;
      }
    }

    .ant-form-item {
      margin-bottom: 20px;

      @media (max-width: 768px) {
        margin-bottom: 16px;
      }
    }

    .ant-form-item:last-child {
      margin-bottom: 0;
    }

    .ant-form-item-label > label {
      font-weight: 500;
      font-size: 14px;
      color: #262626;
      margin-bottom: 8px;

      @media (max-width: 768px) {
        font-size: 13px;
      }
    }

    .ant-checkbox-wrapper {
      &:hover {
        .ant-checkbox-inner {
          border-color: #1890ff;
        }
      }
    }

    /* Modules section styling */
    .modules-section {
      .desktop-loader {
        text-align: center;
        height: 100px;
        position: relative;
        top: 30px;
      }

      /* Desktop Layout - Show on tablet and desktop */
      .desktop-layout {
        display: block;

        @media (max-width: 575px) {
          display: none;
        }

        /* Parent module checkboxes row */
        > .ant-row {
          margin-bottom: 0;

          .ant-col {
            @media (max-width: 767px) {
              margin-bottom: 12px;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }

          .ant-checkbox-wrapper {
            font-weight: 600;
            font-size: 14px;
            display: flex;
            align-items: center;

            @media (max-width: 767px) {
              font-size: 13px;
            }

            .ant-checkbox {
              margin-top: 0;
            }
          }
        }
      }

      /* Mobile Layout - Show only on mobile */
      .mobile-layout {
        display: none;

        @media (max-width: 575px) {
          display: block;
        }

        .module-block {
          margin-bottom: 24px;

          @media (max-width: 400px) {
            margin-bottom: 20px;
          }

          &:last-child {
            margin-bottom: 0;
          }

          /* Parent module checkbox */
          > .ant-checkbox-wrapper {
            font-weight: 600;
            font-size: 14px;
            display: flex;
            align-items: center;
            margin-bottom: 0;

            @media (max-width: 400px) {
              font-size: 13px;
            }

            .ant-checkbox {
              margin-top: 0;
            }
          }
        }

        .module-events-mobile {
          margin-left: 28px;
          margin-top: 12px;

          @media (max-width: 400px) {
            margin-left: 24px;
            margin-top: 10px;
          }

          .ant-checkbox-group {
            width: 100%;

            > div {
              margin-bottom: 12px;

              @media (max-width: 400px) {
                margin-bottom: 10px;
              }

              &:last-child {
                margin-bottom: 0;
              }
            }
          }

          .ant-checkbox-wrapper {
            display: flex;
            align-items: flex-start;
            font-weight: normal;
            font-size: 13px;

            @media (max-width: 400px) {
              font-size: 12px;
            }

            .ant-checkbox {
              margin-top: 2px;
            }
          }
        }
      }
    }

    /* Events grid container - Desktop only */
    .desktop-layout .events-grid-container {
      margin-top: 20px;
      // padding-top: 20px;
      border-top: 1px solid #f0f0f0;

      @media (max-width: 767px) {
        margin-top: 16px;
        padding-top: 16px;
      }

      > .ant-row {
        align-items: flex-start;

        @media (min-width: 576px) and (max-width: 767px) {
          > .ant-col {
            margin-bottom: 16px;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }

    /* Module events grid - Desktop only */
    .desktop-layout .module-events-grid {
      padding: 12px 0 0 0;

      @media (max-width: 767px) {
        padding: 16px 0 0 0;
      }

      .ant-checkbox-wrapper {
        display: flex;
        align-items: flex-start;
        padding: 6px 0;
        width: 100%;

        .ant-checkbox {
          margin-top: 2px;
        }
      }

      .ant-checkbox-group {
        width: 100%;
      }

      .ant-row {
        .ant-col {
          margin-bottom: 2px;

          &:last-child {
            margin-bottom: 0;
          }

          @media (max-width: 767px) {
            margin-bottom: 4px;
          }
        }
      }
    }
  }

  .modal-footer {
    display: flex;
    gap: 8px;
    margin-top: 24px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      margin-top: 20px;
    }

    @media (max-width: 575px) {
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;

      button {
        width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
    }

    @media (min-width: 576px) and (max-width: 768px) {
      gap: 10px;

      button {
        flex: 1 1 auto;
        min-width: 120px;
      }
    }

    @media (min-width: 769px) {
      button {
        min-width: 140px;
      }
    }
  }

  /* Responsive card padding */
  .ant-card {
    border-radius: 8px;
    box-shadow: none;

    @media (max-width: 768px) {
      .ant-card-body {
        padding: 16px !important;
      }
    }

    @media (max-width: 576px) {
      .ant-card-body {
        padding: 12px !important;
      }

      border-radius: 6px;
    }

    + .ant-card {
      @media (max-width: 768px) {
        margin-top: 16px !important;
      }
    }
  }

  /* Responsive text sizes */
  @media (max-width: 768px) {
    .modal-header {
      font-size: 13px;
    }
  }

  @media (max-width: 576px) {
    .modal-header {
      font-size: 12px;
    }

    .webhook-form {
      .ant-form-item-label > label {
        font-size: 12px;
      }
    }
  }

  /* Row spacing on mobile */
  @media (max-width: 767px) {
    .ant-row {
      margin-left: -8px !important;
      margin-right: -8px !important;

      > .ant-col {
        padding-left: 8px !important;
        padding-right: 8px !important;
      }
    }
  }

  /* Ensure form items stack properly on mobile */
  @media (max-width: 576px) {
    .webhook-form {
      .ant-form-item-label {
        padding-bottom: 4px;
      }
    }
  }

  /* Modal content padding on small screens */
  @media (max-width: 576px) {
    padding: 0;

    .modal-header {
      padding: 0 4px;
    }
  }
`;
