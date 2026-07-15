package com.example.jargonaut.ui.main

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Translate
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation3.runtime.NavKey
import com.example.jargonaut.ui.*

@Composable
fun MainScreen(
  onItemClick: (NavKey) -> Unit,
  modifier: Modifier = Modifier,
) {
  var selectedTab by remember { mutableStateOf(0) }

  Scaffold(
    modifier = modifier,
    bottomBar = {
      NavigationBar(containerColor = CardBg) {
        NavigationBarItem(
          selected = selectedTab == 0,
          onClick = { selectedTab = 0 },
          icon = { Icon(Icons.Default.Translate, contentDescription = "Decipher") },
          label = { Text("Decipher") },
          colors = NavigationBarItemDefaults.colors(
            selectedIconColor = ElectricViolet,
            selectedTextColor = ElectricViolet,
            indicatorColor = ElectricViolet.copy(alpha = 0.1f),
            unselectedIconColor = LightGray,
            unselectedTextColor = LightGray
          )
        )

        NavigationBarItem(
          selected = selectedTab == 1,
          onClick = { selectedTab = 1 },
          icon = { Icon(Icons.Default.Book, contentDescription = "Lexicon") },
          label = { Text("Lexicon") },
          colors = NavigationBarItemDefaults.colors(
            selectedIconColor = ElectricViolet,
            selectedTextColor = ElectricViolet,
            indicatorColor = ElectricViolet.copy(alpha = 0.1f),
            unselectedIconColor = LightGray,
            unselectedTextColor = LightGray
          )
        )

        NavigationBarItem(
          selected = selectedTab == 2,
          onClick = { selectedTab = 2 },
          icon = { Icon(Icons.Default.PlayArrow, contentDescription = "Quiz") },
          label = { Text("Quiz") },
          colors = NavigationBarItemDefaults.colors(
            selectedIconColor = ElectricViolet,
            selectedTextColor = ElectricViolet,
            indicatorColor = ElectricViolet.copy(alpha = 0.1f),
            unselectedIconColor = LightGray,
            unselectedTextColor = LightGray
          )
        )

        NavigationBarItem(
          selected = selectedTab == 3,
          onClick = { selectedTab = 3 },
          icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
          label = { Text("Settings") },
          colors = NavigationBarItemDefaults.colors(
            selectedIconColor = ElectricViolet,
            selectedTextColor = ElectricViolet,
            indicatorColor = ElectricViolet.copy(alpha = 0.1f),
            unselectedIconColor = LightGray,
            unselectedTextColor = LightGray
          )
        )
      }
    }
  ) { innerPadding ->
    Box(
      modifier = Modifier
        .fillMaxSize()
        .padding(innerPadding)
    ) {
      when (selectedTab) {
        0 -> DecipherScreen()
        1 -> LexiconScreen()
        2 -> QuizScreen()
        else -> SettingsScreen()
      }
    }
  }
}
