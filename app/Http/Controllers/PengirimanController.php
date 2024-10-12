<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PengirimanController extends Controller
{
    public function index()
    {
        return Inertia::render("Pengiriman/WelcomePengiriman");
    }
    public function login()
    {
        return Inertia::render("Pengiriman/LoginPengiriman");
    }
    public function register()
    {
        return Inertia::render("Pengiriman/SignUpPengiriman");
    }
    public function dashboard()
    {
        return Inertia::render("Pengiriman/Auth/Dashboard");
    }
}
