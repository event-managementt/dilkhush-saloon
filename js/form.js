// --- Hamburger Menu Logic ---
        const navMenu = document.getElementById("navMenu");
        const CLOSE_ON_SCROLL_THRESHOLD = 180;

        function toggleMenu() { navMenu.classList.toggle("active"); }
        window.addEventListener("scroll", function() {
            if (window.scrollY > CLOSE_ON_SCROLL_THRESHOLD && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
            }
        });

        // --- DYNAMIC CALENDAR LOGIC ---
        const calendarDays = document.getElementById('calendar-days');
        const monthSelect = document.getElementById('month-select');
        const yearSelect = document.getElementById('year-select');
        const dateDisplay = document.getElementById('selected-date-display');
        const dateText = document.getElementById('selected-date-text');

        let currentDate = new Date();
        let currentMonth = currentDate.getMonth(); 
        let currentYear = currentDate.getFullYear();
        let todayReal = new Date();
        todayReal.setHours(0,0,0,0);

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        months.forEach((m, i) => {
            let option = document.createElement('option');
            option.value = i;
            option.text = m;
            if(i === currentMonth) option.selected = true;
            monthSelect.appendChild(option);
        });

        for(let y = currentYear; y <= currentYear + 2; y++) {
            let option = document.createElement('option');
            option.value = y;
            option.text = y;
            if(y === currentYear) option.selected = true;
            yearSelect.appendChild(option);
        }

        function renderCalendar(month, year) {
            calendarDays.innerHTML = '';
            let firstDay = new Date(year, month, 1).getDay();
            let daysInMonth = new Date(year, month + 1, 0).getDate();
            let daysInPrevMonth = new Date(year, month, 0).getDate();

            for(let i = firstDay - 1; i >= 0; i--) {
                let div = document.createElement('div');
                div.className = 'cal-day prev-month disabled';
                div.innerText = daysInPrevMonth - i;
                calendarDays.appendChild(div);
            }

            for(let i = 1; i <= daysInMonth; i++) {
                let div = document.createElement('div');
                div.className = 'cal-day';
                div.innerText = i;

                let cellDate = new Date(year, month, i);
                
                if(cellDate < todayReal) {
                    div.classList.add('disabled');
                } else {
                    div.onclick = function() { selectDate(this, i, month, year); };
                }

                if(cellDate.getTime() === todayReal.getTime() && dateDisplay.value === "") {
                    div.classList.add('active');
                    updateDateDisplay(i, month, year);
                }
                calendarDays.appendChild(div);
            }
        }

        function selectDate(element, day, month, year) {
            document.querySelectorAll('#calendar-days .cal-day').forEach(el => el.classList.remove('active'));
            element.classList.add('active');
            updateDateDisplay(day, month, year);
        }

        function updateDateDisplay(day, month, year) {
            let formattedDay = day < 10 ? '0' + day : day;
            let formattedMonth = (month + 1) < 10 ? '0' + (month + 1) : (month + 1);
            dateDisplay.value = `${formattedMonth}/${formattedDay}/${year}`;
            let dayIndex = new Date(year, month, day).getDay();
            dateText.innerText = `${daysOfWeek[dayIndex]}, ${months[month]} ${day}`;
        }

        monthSelect.addEventListener('change', (e) => {
            let selectedM = parseInt(e.target.value);
            let selectedY = parseInt(yearSelect.value);
            if (selectedY === todayReal.getFullYear() && selectedM < todayReal.getMonth()) {
                monthSelect.value = todayReal.getMonth();
                renderCalendar(todayReal.getMonth(), selectedY);
            } else {
                renderCalendar(selectedM, selectedY);
            }
        });

        yearSelect.addEventListener('change', (e) => {
            let selectedM = parseInt(monthSelect.value);
            let selectedY = parseInt(e.target.value);
            if (selectedY === todayReal.getFullYear() && selectedM < todayReal.getMonth()) {
                 monthSelect.value = todayReal.getMonth();
                 selectedM = todayReal.getMonth();
            }
            renderCalendar(selectedM, selectedY);
        });

        function updateClock() {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            
            hours = hours % 12;
            hours = hours ? hours : 12; 
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            
            const timeString = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
            document.getElementById('real-time-clock').innerText = timeString;
        }

        window.addEventListener('load', () => {
            renderCalendar(currentMonth, currentYear);
            updateClock();
            setInterval(updateClock, 1000); 
        });

        // ==========================================
        // YAHAN SE NAYA GOOGLE SHEETS WALA CODE SHURU 
        // ==========================================
        const form = document.querySelector('form');
        const submitBtn = document.querySelector('.submit-btn-new');

        let msgBox = document.createElement('div');
        msgBox.style.marginTop = "15px";
        msgBox.style.textAlign = "center";
        msgBox.style.fontWeight = "600";
        msgBox.style.fontSize = "15px";
        submitBtn.parentNode.appendChild(msgBox);

        form.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const checkboxes = document.querySelectorAll('input[name="service"]:checked');
            let selectedServices = [];
            checkboxes.forEach((cb) => { selectedServices.push(cb.value); });
            
            if(selectedServices.length === 0) {
                msgBox.innerHTML = "<span style='color: #dc3545;'>Please select at least one service!</span>";
                return;
            }

            const stylistSelected = document.querySelector('input[name="stylist"]:checked');

            const formData = {
                fname: document.getElementById('fname').value,
                lname: document.getElementById('lname').value,
                email: document.querySelector('input[name="email"]').value,
                phone: document.querySelector('input[name="phone"]').value,
                service: selectedServices.join(', '), 
                stylist: stylistSelected ? stylistSelected.value : "Any Available",
                appointment_date: document.querySelector('input[name="appointment_date"]').value,
                appointment_time: document.querySelector('input[name="appointment_time"]').value
            };

            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Processing...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";
            msgBox.innerHTML = "";

            const scriptURL = 'https://script.google.com/macros/s/AKfycbw3djNMNAt1gatQy91MzKQqtYBR14jkSPLrExVfSnCPP7tcibw50vwOPv-ALWVtOfxWbg/exec';

            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' }
            })
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success') {
                    msgBox.innerHTML = `<span style='color: #28a745;'>🎉 Success! Check your email to CONFIRM your appointment. Token: ${data.token}</span>`;
                    form.reset(); 
                    document.getElementById('selected-date-display').value = ""; 
                    document.getElementById('selected-date-text').innerText = "Select a date";
                } else {
                    msgBox.innerHTML = "<span style='color: #dc3545;'>Something went wrong. Please try again.</span>";
                }
            })
            .catch(error => {
                console.error('Error!', error.message);
                msgBox.innerHTML = "<span style='color: #dc3545;'>Network error occurred.</span>";
            })
            .finally(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                setTimeout(() => { msgBox.innerHTML = ""; }, 10000);
            });
        });