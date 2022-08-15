// Array Employee
let arrEmployees = [];

function Employee(
   empID,
   empName,
   empEmail,
   empPassword,
   datePicker,
   basePay,
   position,
   labourHour
) {
   this.empID = empID;
   this.empName = empName;
   this.empEmail = empEmail;
   this.empPassword = empPassword;
   this.datePicker = datePicker;
   this.basePay = basePay;
   this.position = position;
   this.labourHour = labourHour;
}

Employee.prototype.calcSalary = function () {
   if (this.position === "GD") {
      return this.basePay * 3;
   } else if (this.position === "TP") {
      return this.basePay * 2;
   } else if (this.position === "NV") {
      return this.basePay;
   }
};

Employee.prototype.calcRank = function () {
   if (this.labourHour < 160) {
      return "Average";
   } else if (this.labourHour < 176) {
      return "Fairly Good";
   } else if (this.labourHour < 192) {
      return "Very Good";
   } else {
      return "Excellent";
   }
};

function dom(id) {
   return document.querySelector(id);
}

function display(arr) {
   let html = "";
   html = arr.reduce((result, employee) => {
      return (
         result +
         `
                <tr>
                    <td>${employee.empID}</td>
                    <td>${employee.empName}</td>
                    <td>${employee.empEmail}</td>
                    <td>${employee.datePicker}</td>
                    <td>${employee.position}</td>
                    <td>${employee.calcSalary()}</td>
                    <td>${employee.calcRank()}</td>
                    <td>
                        <button class="btn btn-success" onclick="selEmployee('${
                           employee.empID
                        }')" data-toggle="modal" data-target="#myModal">Edit</button>
                        <button class="btn btn-danger" onclick="delEmployee('${
                           employee.empID
                        }')">Delete</button>
                    </td>
                </tr>
            `
      );
   }, "");

   dom("#tableDanhSach").innerHTML = html;
}

function resetForm() {
   dom("#tknv").value = "";
   dom("#name").value = "";
   dom("#email").value = "";
   dom("#password").value = "";
   dom("#datepicker").value = "";
   dom("#luongCB").value = "";
   dom("#chucvu").value = "";
   dom("#gioLam").value = "";
}

function init() {
   arrEmployees = JSON.parse(localStorage.getItem("employees")) || [];

   // Create array object
   arrEmployees = arrEmployees.map((employee) => {
      return new Employee(
         employee.empID,
         employee.empName,
         employee.empEmail,
         employee.empPassword,
         employee.datePicker,
         employee.basePay,
         employee.position,
         employee.labourHour
      );
   });

   display(arrEmployees);
}

// Initialization
init();

function addEmployee() {
   // extract the value from each form field
   const empID = dom("#tknv").value;
   const empName = dom("#name").value;
   const empEmail = dom("#email").value;
   const empPassword = dom("#password").value;
   const datePicker = dom("#datepicker").value;
   const basePay = dom("#luongCB").value;
   const position = dom("#chucvu").value;
   const labourHour = dom("#gioLam").value;

   // Validate
   let isValid = validateForm();
   if (!isValid) return;

   // Create employee object
   let employee = new Employee(
      empID,
      empName,
      empEmail,
      empPassword,
      datePicker,
      basePay,
      position,
      labourHour
   );

   // Add to arrEmployees
   arrEmployees.push(employee);
   localStorage.setItem("employees", JSON.stringify(arrEmployees));

   // Dislay
   display(arrEmployees);

   // Reset form
   resetForm();
}

function delEmployee(empID) {
   // Find employee and delete by splice method
   arrEmployees.forEach((employee, index) => {
      if (employee.empID === empID) {
         arrEmployees.splice(index, 1);
         return;
      }
   });

   // update localStorage
   localStorage.setItem("employees", JSON.stringify(arrEmployees));

   // dislay
   display(arrEmployees);
}

function selEmployee(empID) {
   // find employee
   let employee = arrEmployees.find((employee) => {
      return employee.empID === empID;
   });

   // check empty
   if (!employee) {
      return;
   }

   // Fill value
   dom("#tknv").value = employee.empID;
   dom("#tknv").disabled = "true";

   dom("#name").value = employee.empName;
   dom("#email").value = employee.empEmail;
   dom("#password").value = employee.empPassword;
   dom("#datepicker").value = employee.datePicker;
   dom("#luongCB").value = employee.basePay;
   dom("#chucvu").value = employee.position;
   dom("#gioLam").value = employee.labourHour;

   dom("#btnThemNV").disabled = "true";
}

function updateEmployee() {
   // DOM
   const empID = dom("#tknv").value;
   const empName = dom("#name").value;
   const empEmail = dom("#email").value;
   const empPassword = dom("#password").value;
   const datePicker = dom("#datepicker").value;
   const basePay = dom("#luongCB").value;
   const position = dom("#chucvu").value;
   const labourHour = dom("#gioLam").value;

   // Validate
   let isValid = validateForm();

   if (!isValid) return;

   // Create new Object
   let updateEmp = new Employee(
      empID,
      empName,
      empEmail,
      empPassword,
      datePicker,
      basePay,
      position,
      labourHour
   );

   // Check index old object
   let index = arrEmployees.findIndex((item) => {
      return item.empID === updateEmp.empID;
   });

   // Update
   arrEmployees[index] = updateEmp;
   localStorage.setItem("employees", JSON.stringify(arrEmployees));

   // Display
   display(arrEmployees);

   // Reset Form
   resetForm();
}

// Rank
function filterRank(string) {
   return arrEmployees.filter((employee) => {
      return employee.calcRank() === string;
   });
}

function searchRank() {
   let valSearch = dom("#searchName").value;
   valSearch = valSearch.toLowerCase();
   let arr = [];

   if (valSearch === "fairly good") {
      arr = filterRank("Fairly Good");
   } else if (valSearch === "very good") {
      arr = filterRank("Very Good");
   } else if (valSearch === "average") {
      arr = filterRank("Average");
   } else if (valSearch === "excellent") {
      arr = filterRank("Excellent");
   }

   if (!valSearch) {
      display(arrEmployees);
      return;
   }

   display(arr);
}

// Validation
function validateID() {
   let id = dom("#tknv").value;
   let spanEl = dom("#tbTKNV");

   spanEl.style.display = "block";

   if (!id) {
      spanEl.innerHTML = "Tài khoản nhân viên không để trống!";
      return false;
   }

   if (id.length < 4 || id.length > 6) {
      spanEl.innerHTML = "Tài khoản nhân viên từ 4-6 kí tự!";
      return false;
   }

   spanEl.style.display = "none";
   return true;
}

function validateName() {
   let name = dom("#name").value;
   let spanEl = dom("#tbTen");

   spanEl.style.display = "block";

   if (!name) {
      spanEl.innerHTML = "Tên nhân viên không được để trống";
      return false;
   }

   // Regular expression name
   let regex =
      /^[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+(?:[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]*)*/;

   if (!regex.test(name)) {
      spanEl.innerHTML =
         "Tên nhân viên là chữ, viết hoa chữ cái đầu và không khoảng trắng";
      return false;
   }

   spanEl.style.display = "none";
   return true;
}

function validateEmail() {
   let email = dom("#email").value;
   let spanEl = dom("#tbEmail");

   spanEl.style.display = "block";

   if (!email) {
      spanEl.innerHTML = "Email không được để trống!";
      return false;
   }

   // Regular express email
   let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

   if (!regex.test(email)) {
      spanEl.innerHTML = "Email không đúng định dạng!";
      return false;
   }

   spanEl.style.display = "none";
   return true;
}

function validatePassword() {
   const password = dom("#password").value;
   const spanEl = dom("#tbMatKhau");

   spanEl.style.display = "block";

   if (!password) {
      spanEl.innerHTML = "Mật khẩu không được để trống";
      return false;
   }

   // Regular expression password
   let regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*?[#?!@$%^&*-]).{8,10}$/;

   if (!regex.test(password)) {
      spanEl.innerHTML =
         "Mật khẩu 6-10 ký tự, 1 viết hoa, 1 viết thường, 1 ký tự đặc biệt và 1 số";
      return false;
   }

   spanEl.style.display = "none";
   return true;
}

function validateDate() {
   const datePicker = dom("#datepicker").value;
   const spanEl = dom("#tbNgay");

   spanEl.style.display = "block";

   if (!datePicker) {
      spanEl.innerHTML = "Ngày vào làm không được để trống";
      return false;
   }

   // Regular Expression datePicker
   let regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

   if (!regex.test(datePicker)) {
      spanEl.innerHTML = "Ngày vào làm theo định dạng mm/dd/yyyy";
      return false;
   }

   spanEl.style.display = "none";
   return true;
}

function validateSalary() {
   const salary = dom("#luongCB").value;
   const spanEl = dom("#tbLuongCB");

   spanEl.style.display = "block";

   if (!salary) {
      spanEl.innerHTML = "Lương không được để trống";
      return false;
   }

   if (salary < 1000000 || salary > 20000000) {
      spanEl.innerHTML = "Lương từ 1.000.000 - 20.000.000";
      return false;
   }

   spanEl.style.display = "none";
   return true;
}

function validatePosition() {
   const position = dom("#chucvu").value;
   const spanEl = dom("#tbChucVu");

   spanEl.style.display = "block";

   if (!position) {
      spanEl.innerHTML = "Chức vụ không được để trống";
      return false;
   }

   spanEl.style.display = "none";
   return true;
}

function validateLabourHour() {
   const labourHour = dom("#gioLam").value;
   const spanEl = dom("#tbGiolam");

   spanEl.style.display = "block";

   if (!labourHour) {
      spanEl.innerHTML = "Giờ làm không được để trống";
      return false;
   }

   spanEl.style.display = "none";
   return true;
}

function validateForm() {
   let isValid = true;

   isValid =
      validateID() &
      validateName() &
      validateEmail() &
      validatePassword() &
      validateDate() &
      validateSalary() &
      validatePosition() &
      validateLabourHour();

   if (!isValid) {
      return false;
   }

   return true;
}
