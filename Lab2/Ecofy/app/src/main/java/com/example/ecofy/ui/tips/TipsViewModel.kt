package com.example.ecofy.ui.tips

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ecofy.data.model.tip.Tip
import com.example.ecofy.data.repository.TipRepository
import kotlinx.coroutines.launch

class TipsViewModel(
    private val repository: TipRepository
) : ViewModel() {

    private val _categories = MutableLiveData<List<String>>()
    val categories: LiveData<List<String>> = _categories

    private val _tips = MutableLiveData<List<Tip>>()
    val tips: LiveData<List<Tip>> = _tips

    fun loadCategories() {
        viewModelScope.launch {
            try {
                _categories.value = repository.getCategories()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun loadTips(category: String?) {
        viewModelScope.launch {
            try {
                _tips.value = repository.getTips(category)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}