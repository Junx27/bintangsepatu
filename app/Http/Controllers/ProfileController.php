<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
    public function updateProfile(Request $request, String $id)
    {
        $validated = $request->validate([
            "name" => "required",
            "image" => "required",
        ]);
        $user = User::findOrFail($id);
        if ($request->hasFile('image')) {
            if ($user->image) {
                Storage::disk("public")->delete($user->image);
            }
            $validated['image'] = $request->file('image')->store('image_profile', 'public');
        }
        $user->update($validated);
        if ($user->role === 'produksi') {
            return redirect()->intended(route('dashboard.produksi', absolute: false));
        } elseif ($user->role === 'gudang') {
            return redirect()->intended(route('dashboard.gudang', absolute: false));
        } elseif ($user->role === 'pengiriman') {
            return redirect()->intended(route('dashboard.pengiriman', absolute: false));
        } elseif ($user->role === 'penjualan') {
            return redirect()->intended(route('dashboard.penjualan', absolute: false));
        }
    }
}
