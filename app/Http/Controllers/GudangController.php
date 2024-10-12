<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class GudangController extends Controller
{
    public function index()
    {
        return Inertia::render("Gudang/WelcomeGudang");
    }
    public function login()
    {
        return Inertia::render("Gudang/LoginGudang");
    }
    public function register()
    {
        return Inertia::render("Gudang/SignUpGudang");
    }
    public function dashboard()
    {
        return Inertia::render("Gudang/Auth/Dashboard");
    }
}
