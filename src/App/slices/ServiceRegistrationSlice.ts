import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServiceRegistrationState {
  currentStep: number;
  serviceId: string;
  formData: {
    name: string;
    discription: string;
    files: File[];
  };
  selectedAddress: string;
  serviceData: {
    _id: string;
    name: string;
    discription: string;
    serviceCharge: number;
    imageKey: string;
  } | null;
  imageUrl: string;
}

const initialState: ServiceRegistrationState = {
  currentStep: 1,
  serviceId: "",
  formData: {
    name: "",
    discription: "",
    files: [],
  },
  selectedAddress: "",
  serviceData: null,
  imageUrl: "",
};

export const serviceRegistrationSlice = createSlice({
  name: "serviceRegistration",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 3) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    setServiceId: (state, action: PayloadAction<string>) => {
      state.serviceId = action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<Partial<ServiceRegistrationState["formData"]>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setSelectedAddress: (state, action: PayloadAction<string>) => {
      state.selectedAddress = action.payload;
    },
    setServiceData: (
      state,
      action: PayloadAction<ServiceRegistrationState["serviceData"]>
    ) => {
      state.serviceData = action.payload;
    },
    setImageUrl: (state, action: PayloadAction<string>) => {
      state.imageUrl = action.payload;
    },
    resetRegistration: () => initialState,
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  setServiceId,
  setFormData,
  setSelectedAddress,
  setServiceData,
  setImageUrl,
  resetRegistration,
} = serviceRegistrationSlice.actions;

export default serviceRegistrationSlice.reducer;