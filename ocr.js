const OCR_API_KEY = "K87603468888957";

async function scanReceipt(file){

    const status = document.getElementById("ocrStatus");

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

        const data = await response.json();

        console.log(data);

        const text = data.ParsedResults[0].ParsedText;

        console.log(text);

        fillExpenseForm(text);

        status.textContent = "Receipt scanned!";

    }

    catch(error){

        console.error(error);

        status.textContent = "OCR failed.";

    }

}

function fillExpenseForm(text){

    const amountMatch = text.match(/\d+\.\d{2}/);

    if(amountMatch){

        document.getElementById("amount").value =
        amountMatch[0];

    }

    const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);

    if(dateMatch){

        const parts =
        dateMatch[0].split("/");

        document.getElementById("date").value =

        `${parts[2]}-${parts[0]}-${parts[1]}`;

    }

}