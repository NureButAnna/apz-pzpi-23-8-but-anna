package com.example.ecofy.ui.navigation

import com.example.ecofy.R
import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import com.example.ecofy.ui.map.MapActivity
import com.example.ecofy.ui.settings.SettingsActivity
import com.example.ecofy.ui.tips.TipsActivity

enum class Tab {
    MAIN, MAP, TIPS, ACCOUNT
}

class BottomNavManager(private val activity: Activity) {

    fun setup() {

        val tabMain = activity.findViewById<LinearLayout>(R.id.tab_main)
        val tabMap = activity.findViewById<LinearLayout>(R.id.tab_map)
        val tabTips = activity.findViewById<LinearLayout>(R.id.tab_tips)
        val tabAccount = activity.findViewById<LinearLayout>(R.id.tab_account)

        tabMain.setOnClickListener {
            setActive(Tab.MAIN)
        }

        tabMap.setOnClickListener {
            activity.startActivity(Intent(activity, MapActivity::class.java))
        }

        tabTips.setOnClickListener {
            activity.startActivity(Intent(activity, TipsActivity::class.java))
        }

        tabAccount.setOnClickListener {
            activity.startActivity(Intent(activity, SettingsActivity::class.java))
        }

        setActive(Tab.MAIN)
    }

    fun setActive(active: Tab) {

        val green = "#5BCF90"
        val gray = "#9E9E9E"

        val mainIcon = activity.findViewById<ImageView>(R.id.icon_main)
        val mapIcon = activity.findViewById<ImageView>(R.id.icon_map)
        val tipsIcon = activity.findViewById<ImageView>(R.id.icon_tips)
        val accountIcon = activity.findViewById<ImageView>(R.id.icon_user)

        val mainText = activity.findViewById<TextView>(R.id.text_main)
        val mapText = activity.findViewById<TextView>(R.id.text_map)
        val tipsText = activity.findViewById<TextView>(R.id.text_tips)
        val accountText = activity.findViewById<TextView>(R.id.text_account)

        fun reset() {
            mainIcon.setColorFilter(Color.parseColor(gray))
            mapIcon.setColorFilter(Color.parseColor(gray))
            tipsIcon.setColorFilter(Color.parseColor(gray))
            accountIcon.setColorFilter(Color.parseColor(gray))

            mainText.setTextColor(Color.parseColor(gray))
            mapText.setTextColor(Color.parseColor(gray))
            tipsText.setTextColor(Color.parseColor(gray))
            accountText.setTextColor(Color.parseColor(gray))
        }

        reset()

        when (active) {
            Tab.MAIN -> {
                mainIcon.setColorFilter(Color.parseColor(green))
                mainText.setTextColor(Color.parseColor(green))
            }
            Tab.MAP -> {
                mapIcon.setColorFilter(Color.parseColor(green))
                mapText.setTextColor(Color.parseColor(green))
            }
            Tab.TIPS -> {
                tipsIcon.setColorFilter(Color.parseColor(green))
                tipsText.setTextColor(Color.parseColor(green))
            }
            Tab.ACCOUNT -> {
                accountIcon.setColorFilter(Color.parseColor(green))
                accountText.setTextColor(Color.parseColor(green))
            }
        }
    }
}