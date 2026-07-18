package com.example.jargonaut

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.example.jargonaut.data.GlossaryDatabase
import com.example.jargonaut.theme.JargonautTheme

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Parse deep link
    val intentData = intent?.data
    if (intentData != null && intentData.host == "checkout") {
      if (intentData.getQueryParameter("status") == "success") {
        GlossaryDatabase.setPremium(this, true)
        Toast.makeText(this, "👑 Jargonaut Premium Activated!", Toast.LENGTH_LONG).show()
      }
    }

    enableEdgeToEdge()
    setContent {
      JargonautTheme { Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) { MainNavigation() } }
    }
  }
}
