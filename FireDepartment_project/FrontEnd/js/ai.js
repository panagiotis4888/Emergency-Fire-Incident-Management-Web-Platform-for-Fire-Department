function addMessage(message, sender) {
    const messageDiv = $('<div>').addClass(sender === 'user' ? 'user-message' : 'bot-message').text(message);
    $('#chat-messages').append(messageDiv);
    $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
}

function sendMessage() {
    const apiUrl = "https://api.openai.com/v1/completions";
    const apiKey = "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"; // Replace with your OpenAI API key

    const userInput = $('#user-input').val().trim();
    if (!userInput) {
        return;
    }

    addMessage(userInput, 'user');
    $('#user-input').val('');

    $.ajax({
        url: apiUrl,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        data: JSON.stringify({
            model: "gpt-3.5-turbo",
            store: true,
            messages: [`Answer the following fire-accident-related question: "${userInput}"`],
            max_tokens: 150,
            temperature: 0.7,
        }),
        success: function(response) {
            const botReply = response.choices[0].text.trim();
            addMessage(botReply, 'bot');
        },
        error: function(xhr, status, error) {
            addMessage("Sorry, something went wrong. Please try again later.", 'bot');
            console.error("Error:", error);
        }
    });
}


$(() => {


    $('#send-btn').on('click', sendMessage);

    $('#user-input').on('keypress', function(e) {
        if (e.which === 13) {
            $('#send-btn').click();
        }
    });

    $('#questions button').on('click', function(e) {
        console.log(this);
        $('#user-input').val(this.textContent);
        sendMessage();
        $('#questions').hide();
    });


});
