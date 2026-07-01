const OCR_API_KEY = "K87603468888957";

async function scanReceipt(file){

    const status = document.getElementById("ocrStatus");

    if(!status){

        return;

    }

    if(!file){

        status.textContent = "No receipt selected.";

        return;

    }

    status.textContent = "Scanning receipt...";

    const formData = new FormData();

    formData.append("file", file);

    formData.append("language", "eng");

    formData.append("OCREngine", "2");

    try{

        const response = await fetch(
            "https://api.ocr.space/parse/image",
            {

                method: "POST",

                headers:{

                    apikey: OCR_API_KEY

                },

                body: formData

            }
        );

        if(!response.ok){

            throw new Error(`OCR request failed: ${response.status}`);

        }

        const data = await response.json();

        const text = data?.ParsedResults?.[0]?.ParsedText?.trim() || "";

        if(!text){

            status.textContent = "No text found in receipt.";

            return;

        }

        console.log("OCR text:", text);

        fillExpenseForm(text);

        status.textContent = "Receipt scanned!";

    }

    catch(error){

        console.error(error);

        status.textContent = "OCR failed. Please try another image.";

    }

}

function fillExpenseForm(text){

    const normalizedText = text.replace(/\r/g, "\n");

    const amountMatch =
        normalizedText.match(/(?:total|amount|subtotal|balance|due)[^\n\r]{0,20}(\$?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})|\d+(?:[.,]\d{2}))/i)
        || normalizedText.match(/\b(?:\$)?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})\b/);

    if(amountMatch){

        const rawAmount = amountMatch[1] || amountMatch[0];

        const cleanedAmount = rawAmount.replace(/[$,]/g, "");

        document.getElementById("amount").value =
            Number(cleanedAmount).toFixed(2);

    }

    const dateMatch =
        normalizedText.match(/\b(\d{4})-(\d{2})-(\d{2})\b/)
        || normalizedText.match(/\b(\d{2})[/-](\d{2})[/-](\d{4})\b/)
        || normalizedText.match(/\b([A-Za-z]{3,9})\s+(\d{1,2}),\s*(\d{4})\b/);

    if(dateMatch){

        if(dateMatch[1].length === 4){

            document.getElementById("date").value =
                `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;

        }

        else{

            const day = dateMatch[1];

            const month = dateMatch[2];

            const year = dateMatch[3];

            const isDayFirst = Number(day) > 12;

            const formattedDay = isDayFirst ? day : month;

            const formattedMonth = isDayFirst ? month : day;

            document.getElementById("date").value =
                `${year}-${formattedMonth.padStart(2, "0")}-${formattedDay.padStart(2, "0")}`;

        }

    }

}

document.addEventListener("DOMContentLoaded", function(){

    const receiptInput = document.getElementById("receipt");

    if(receiptInput){

        receiptInput.addEventListener("change", function(event){

            const file = event.target.files?.[0];

            if(file){

                scanReceipt(file);

            }

        });

    }

});