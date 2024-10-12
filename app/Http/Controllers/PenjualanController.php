<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PenjualanController extends Controller
{
    public function index()
    {
        return Inertia::render("Penjualan/WelcomePenjualan");
    }
    public function login()
    {
        return Inertia::render("Penjualan/LoginPenjualan");
    }
    public function register()
    {
        return Inertia::render("Penjualan/SignUpPenjualan");
    }
    public function dashboard()
    {
        return Inertia::render("Penjualan/Auth/Dashboard");
    }
}
