document.addEventListener('DOMContentLoaded', function() {
    // تهيئة البيانات
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let currentFilter = 'all';
    let currentMonth = new Date().getMonth() + 1; // الشهر الحالي تلقائياً

    // عناصر DOM
    const form = document.getElementById('transaction-form');
    const list = document.getElementById('transaction-list');
    
    // تعيين تاريخ اليوم كافتراضي
    if (document.getElementById('date')) {
        document.getElementById('date').valueAsDate = new Date();
    }

    // أحداث التبويبات
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.id.replace('-tab', '');
            renderTransactions();
        });
    });

    // حدث إضافة معاملة
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = document.getElementById('type').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const note = document.getElementById('note').value;
            const category = document.getElementById('category').value;
            const date = document.getElementById('date').value;
            
            if (!type || !amount || isNaN(amount) || !category || !date) {
                alert('الرجاء إدخال جميع البيانات المطلوبة');
                return;
            }
            
            transactions.unshift({
                type,
                amount,
                note,
                category,
                date: formatDate(date)
            });
            
            saveTransactions();
            renderTransactions();
            form.reset();
            document.getElementById('date').valueAsDate = new Date();
        });
    }

    // عرض المعاملات
    function renderTransactions() {
        if (!list) return;
        list.innerHTML = '';
        
        // تطبيق الفلاتر
        let filtered = transactions.filter(trx => {
            let match = true;
            
            // فلترة حسب النوع
            if (currentFilter !== 'all' && trx.type !== currentFilter) {
                match = false;
            }
            
            // فلترة حسب الشهر الحالي تلقائياً
            const trxMonth = new Date(trx.date).getMonth() + 1;
            if (trxMonth !== currentMonth) {
                match = false;
            }
            
            return match;
        });
        
        // عرض النتائج
        if (filtered.length === 0) {
            list.innerHTML = '<div class="no-results">لا توجد معاملات لعرضها هذا الشهر</div>';
            return;
        }
        
        filtered.forEach((trx, index) => {
            const item = document.createElement('div');
            item.className = `data-item ${trx.type}`;
            item.innerHTML = `
                <div class="data-details">
                    <div class="data-title">
                        ${trx.type === 'income' ? 'مد
