package com.example.ecofy.ui.auth

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ecofy.R

class VerificationActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_verification)

        val code1: EditText = findViewById(R.id.code1)
        val code2: EditText = findViewById(R.id.code2)
        val code3: EditText = findViewById(R.id.code3)
        val code4: EditText = findViewById(R.id.code4)

        val button: Button = findViewById(R.id.btn_continue)
        val resend: TextView = findViewById(R.id.resend)

        button.setOnClickListener {

            val code = code1.text.toString() +
                    code2.text.toString() +
                    code3.text.toString() +
                    code4.text.toString()

            if (code.length < 4) {
                Toast.makeText(this, "Введіть повний код", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // тут буде API перевірки коду
            Toast.makeText(this, "Код: $code", Toast.LENGTH_SHORT).show()
        }


        resend.setOnClickListener {
            Toast.makeText(this, "Код відправлено повторно", Toast.LENGTH_SHORT).show()

            // тут буде API resend
        }

        setupAutoMove(code1, code2)
        setupAutoMove(code2, code3)
        setupAutoMove(code3, code4)
    }

    private fun setupAutoMove(current: EditText, next: EditText) {
        current.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                if (s.toString().length == 1) {
                    next.requestFocus()
                }
            }

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })
    }
}