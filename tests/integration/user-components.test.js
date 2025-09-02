// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import SignIn from "../../src/components/SignIn";
// import DetailsForm from "../../src/components/DetailsForm";
// import { apiCall } from "../../src/utils/api";

// // Mock the API utility
// jest.mock("../../src/utils/api");
// const mockApiCall = apiCall;

// describe("Authentication Components Integration", () => {
//   test("SignIn component integrates with API service", async () => {
//     // Mock API response
//     mockApiCall.mockResolvedValue({
//       user: { id: "123", name: "John Doe", email: "john@example.com" },
//     });

//     const onSuccess = jest.fn();

//     render(<SignIn onSuccess={onSuccess} onSwitchToSignUp={() => {}} />);

//     // User interaction
//     fireEvent.change(screen.getByLabelText(/email/i), {
//       target: { value: "john@example.com" },
//     });
//     fireEvent.change(screen.getByLabelText(/password/i), {
//       target: { value: "password123" },
//     });
//     fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

//     // Verify integration
//     await waitFor(() => {
//       expect(mockApiCall).toHaveBeenCalledWith("/signin", {
//         method: "POST",
//         body: JSON.stringify({
//           email: "john@example.com",
//           password: "password123",
//         }),
//       });
//       expect(onSuccess).toHaveBeenCalledWith({
//         user: { id: "123", name: "John Doe", email: "john@example.com" },
//       });
//     });
//   });

//   test("DetailsForm integrates with user state and API", async () => {
//     const mockUser = { id: "123", name: "John Doe", email: "john@example.com" };
//     const onDetailsComplete = jest.fn();

//     // Mock API calls
//     mockApiCall
//       .mockResolvedValueOnce({ age: "", gender: "", phone: "" }) // GET details
//       .mockResolvedValueOnce({ success: true }); // POST details

//     render(
//       <DetailsForm
//         user={mockUser}
//         onLogout={() => {}}
//         onDetailsComplete={onDetailsComplete}
//       />
//     );

//     // Fill form
//     fireEvent.change(screen.getByLabelText(/age/i), {
//       target: { value: "30" },
//     });
//     fireEvent.change(screen.getByLabelText(/phone/i), {
//       target: { value: "+1234567890" },
//     });

//     // Submit
//     fireEvent.click(screen.getByRole("button", { name: /save details/i }));

//     // Verify integration
//     await waitFor(() => {
//       expect(mockApiCall).toHaveBeenCalledWith("/user/123/details", {
//         method: "POST",
//         body: JSON.stringify({
//           age: "30",
//           gender: "",
//           phone: "+1234567890",
//           address: "",
//           city: "",
//           state: "",
//           postal_code: "",
//           occupation: "",
//         }),
//       });
//     });
//   });
// });
